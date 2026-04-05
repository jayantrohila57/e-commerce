import type { z } from "zod/v3";
import type { productInsertSchema } from "./product.schema";

type ProductData = z.infer<typeof productInsertSchema>;

export const ProductPdpPreview = ({ data }: { data: ProductData }) => {
  return (
    <div className="p-4 border rounded-lg bg-card">
      <h2 className="text-2xl font-bold mb-4">Product PDP Preview</h2>
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold">Title</h3>
          <p>{data.title || "No title provided"}</p>
        </div>
        <div>
          <h3 className="font-semibold">Slug</h3>
          <p>{data.slug || "No slug provided"}</p>
        </div>
        <div>
          <h3 className="font-semibold">Description</h3>
          <p>{data.description || "No description provided"}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold">Base Price</h3>
            <p>
              {data.baseCurrency} {data.basePrice}
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Status</h3>
            <p className="capitalize">{data.status}</p>
          </div>
        </div>
        <div>
          <h3 className="font-semibold">Features</h3>
          <ul className="list-disc ml-5">
            {data.features?.map((feature, index) => <li key={index}>{feature.title || "Empty feature"}</li>) || (
              <p>No features added</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};
