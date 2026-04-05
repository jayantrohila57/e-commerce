import { inventoryAdjustmentEvent, inventoryItem } from "@/core/db/db.schema";
import {
  adjustInventoryForReturn,
  applyInventoryDelta,
  type InventoryDeltaContext,
} from "@/module/inventory/inventory.api";

type TestInventory = {
  id: string;
  variantId: string;
  warehouseId: string | null;
  quantity: number;
  incoming: number;
  reserved: number;
};

type InventoryTestState = {
  inventory: TestInventory | null;
  events: (typeof inventoryAdjustmentEvent.$inferInsert)[];
};

function createMockTx(initial: TestInventory | null): {
  state: InventoryTestState;
  tx: unknown;
} {
  const state: InventoryTestState = {
    inventory: initial,
    events: [],
  };

  const tx = {
    query: {
      inventoryItem: {
        findFirst: async () => state.inventory,
      },
    },
    update: (_table: unknown) => ({
      set: (values: Partial<TestInventory> & { updatedAt?: Date }) => ({
        where: (_where: unknown) => ({
          returning: async () => {
            if (!state.inventory) {
              return [];
            }
            state.inventory = {
              ...state.inventory,
              ...values,
            };
            return [state.inventory];
          },
        }),
      }),
    }),
    insert: (table: unknown) => {
      return {
        values: async (payload: unknown) => {
          // When inserting into `inventoryItem`, simulate row creation.
          if (table === inventoryItem) {
            const created = payload as TestInventory;
            state.inventory = {
              ...created,
              quantity: created.quantity ?? 0,
              incoming: created.incoming ?? 0,
              reserved: created.reserved ?? 0,
            };
            return [state.inventory];
          }

          // When inserting into `inventoryAdjustmentEvent`, capture the event.
          if (table === inventoryAdjustmentEvent) {
            state.events.push(payload as typeof inventoryAdjustmentEvent.$inferInsert);
            return [];
          }

          return [];
        },
      };
    },
  };

  return { state, tx };
}

async function testApplyInventoryDeltaWritesEvent() {
  const { state, tx } = createMockTx({
    id: "inv-1",
    variantId: "var-1",
    warehouseId: "wh-1",
    quantity: 10,
    incoming: 0,
    reserved: 2,
  });

  const context: InventoryDeltaContext = {
    inventoryId: "inv-1",
    quantityDelta: -3,
    reservedDelta: -2,
    incomingDelta: 0,
    type: "order",
    warehouseId: "wh-1",
    variantId: "var-1",
    orderId: "order-1",
    reason: "Test order deduction",
    adjustedBy: "user-1",
  };

  await applyInventoryDelta(tx as never, context);

  if (!state.inventory) {
    throw new Error("Inventory should exist after applyInventoryDelta");
  }

  if (state.inventory.quantity !== 7 || state.inventory.reserved !== 0) {
    throw new Error(
      `Unexpected inventory numbers after delta: qty=${state.inventory.quantity}, reserved=${state.inventory.reserved}`,
    );
  }

  if (state.events.length !== 1) {
    throw new Error(`Expected 1 adjustment event, got ${state.events.length}`);
  }

  const event = state.events[0];

  if (event.type !== "order") {
    throw new Error(`Expected event type "order", got "${event.type}"`);
  }

  if (event.orderId !== "order-1") {
    throw new Error(`Expected event.orderId to be "order-1", got "${event.orderId}"`);
  }

  if (event.quantityBefore !== 10 || event.quantityAfter !== 7 || event.quantityDelta !== -3) {
    throw new Error(
      `Unexpected quantity fields in event: before=${event.quantityBefore}, delta=${event.quantityDelta}, after=${event.quantityAfter}`,
    );
  }

  if (event.reservedBefore !== 2 || event.reservedAfter !== 0 || event.reservedDelta !== -2) {
    throw new Error(
      `Unexpected reserved fields in event: before=${event.reservedBefore}, delta=${event.reservedDelta}, after=${event.reservedAfter}`,
    );
  }
}

async function testAdjustInventoryForReturnCreatesRowAndEvent() {
  const { state, tx } = createMockTx(null);

  await adjustInventoryForReturn(tx as never, {
    variantId: "var-2",
    warehouseId: "wh-2",
    quantity: 5,
    orderId: "order-2",
    refundId: "refund-2",
    reason: "Return test",
    adjustedBy: "user-2",
  });

  if (!state.inventory) {
    throw new Error("Inventory should be created for return when none exists");
  }

  if (state.inventory.quantity !== 5) {
    throw new Error(`Expected inventory.quantity to be 5 after return, got ${state.inventory.quantity}`);
  }

  if (state.events.length !== 1) {
    throw new Error(`Expected 1 adjustment event for return, got ${state.events.length}`);
  }

  const event = state.events[0];

  if (event.type !== "return") {
    throw new Error(`Expected event type "return" for adjustInventoryForReturn, got "${event.type}"`);
  }

  if (event.orderId !== "order-2" || event.refundId !== "refund-2") {
    throw new Error(
      `Expected event to carry orderId/refundId, got orderId="${event.orderId}", refundId="${event.refundId}"`,
    );
  }

  if (event.quantityBefore !== 0 || event.quantityAfter !== 5 || event.quantityDelta !== 5) {
    throw new Error(
      `Unexpected quantity fields in return event: before=${event.quantityBefore}, delta=${event.quantityDelta}, after=${event.quantityAfter}`,
    );
  }
}

async function run() {
  const tests: { name: string; fn: () => Promise<void> }[] = [
    { name: "applyInventoryDelta writes a complete movement event", fn: testApplyInventoryDeltaWritesEvent },
    {
      name: "adjustInventoryForReturn creates inventory and return event",
      fn: testAdjustInventoryForReturnCreatesRowAndEvent,
    },
  ];

  let failed = 0;

  for (const test of tests) {
    try {
      // eslint-disable-next-line no-console
      console.log(`▶ ${test.name}`);
      await test.fn();
      // eslint-disable-next-line no-console
      console.log(`✔ ${test.name}`);
    } catch (err) {
      failed += 1;
      // eslint-disable-next-line no-console
      console.error(`✘ ${test.name}`);
      // eslint-disable-next-line no-console
      console.error(err);
    }
  }

  if (failed > 0) {
    // eslint-disable-next-line no-console
    console.error(`\n${failed} test(s) failed`);
    process.exitCode = 1;
  } else {
    // eslint-disable-next-line no-console
    console.log("\nAll inventory movement tests passed");
  }
}

// Run directly when executed via `tsx`
// eslint-disable-next-line unicorn/prefer-top-level-await
void run();
