const fs = require('fs')
const path = require('path')

const modulesDir = path.join(__dirname, 'src', 'module')

// Get all router files
const routerFiles = []

function findRouterFiles(dir) {
  const files = fs.readdirSync(dir)

  files.forEach((file) => {
    const fullPath = path.join(dir, file)
    const stat = fs.statSync(fullPath)

    if (stat.isDirectory()) {
      findRouterFiles(fullPath)
    } else if (file.endsWith('.router.ts') && file.includes('api.')) {
      routerFiles.push(fullPath)
    }
  })
}

// Skip the user router since it's our template
findRouterFiles(modulesDir)

// Process each router file
routerFiles.forEach((routerFile) => {
  if (routerFile.includes('user')) return // Skip user router

  console.log(`Processing ${routerFile}...`)

  // Get module name from file path
  const moduleName = path.basename(routerFile).split('.')[1]
  const controllerName = `api.${moduleName}.controller`
  const contractName = `dto.${moduleName}.contract`

  // Generate new content
  const newContent = `import { ${moduleName}Controller } from './${controllerName}'
import { ${moduleName}Contract } from '../dto/${contractName}'
import { createTRPCRouter, protectedProcedure } from '@/core/api/trpc'

export const ${moduleName}Router = createTRPCRouter({
  get: protectedProcedure
    .input(${moduleName}Contract.get.input)
    .output(${moduleName}Contract.get.output)
    .query(({ input }) => ${moduleName}Controller.get({ input })),
  getMany: protectedProcedure
    .input(${moduleName}Contract.getMany.input)
    .output(${moduleName}Contract.getMany.output)
    .query(({ input }) => ${moduleName}Controller.getMany({ input })),
  create: protectedProcedure
    .input(${moduleName}Contract.create.input)
    .output(${moduleName}Contract.create.output)
    .mutation(({ input }) => ${moduleName}Controller.create({ input })),
  update: protectedProcedure
    .input(${moduleName}Contract.update.input)
    .output(${moduleName}Contract.update.output)
    .mutation(({ input }) => ${moduleName}Controller.update({ input })),
  delete: protectedProcedure
    .input(${moduleName}Contract.delete.input)
    .output(${moduleName}Contract.delete.output)
    .mutation(({ input }) => ${moduleName}Controller.delete({ input })),
})`

  // Write the new content to the file
  fs.writeFileSync(routerFile, newContent)
  console.log(`Updated ${routerFile}`)
})

console.log('All router files have been updated!')
