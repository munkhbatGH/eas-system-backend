import * as fs from 'fs';
import * as path from 'path';

// Auto-discover and export all schemas
export function getMongooseFeatures() {
  const features: Array<{ name: string; schema: any }> = [];
  const schemaFiles = fs.readdirSync(__dirname).filter(file => 
    file.endsWith('.schema.ts') || file.endsWith('.schema.js')
  );

  for (const file of schemaFiles) {
    try {
      const schemaModule = require(path.join(__dirname, file));
      const schema = schemaModule.default || schemaModule[Object.keys(schemaModule).find(key => key.endsWith('Schema'))!];
      
      if (schema) {
        // Extract model name from filename: user.schema.ts -> User
        const modelName = file.replace(/\.schema\.(ts|js)$/, '');
        const capitalizedName = modelName.charAt(0).toUpperCase() + modelName.slice(1);
        features.push({ name: capitalizedName, schema });
      }
    } catch (error) {
      console.error(`Failed to load schema ${file}:`, error);
    }
  }

  return features;
}