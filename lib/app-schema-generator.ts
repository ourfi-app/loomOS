
/**
 * Database Schema Generator
 * Generates Prisma schemas and migrations for new apps
 */

export interface SchemaField {
  name: string;
  type: 'String' | 'Int' | 'Float' | 'Boolean' | 'DateTime' | 'Json';
  required: boolean;
  unique: boolean;
  default?: string;
  relation?: string;
}

export interface SchemaModel {
  name: string;
  fields: SchemaField[];
  indexes?: string[];
  relations?: Array<{
    field: string;
    model: string;
    type: 'one-to-one' | 'one-to-many' | 'many-to-many';
  }>;
}

export interface DatabaseSchema {
  models: SchemaModel[];
  enums?: Array<{
    name: string;
    values: string[];
  }>;
}

export class SchemaGenerator {
  /**
   * Generate Prisma schema from model definition
   */
  static generatePrismaSchema(schema: DatabaseSchema): string {
    let prismaSchema = '';

    // Generate enums
    if (schema.enums && schema.enums.length > 0) {
      for (const enumDef of schema.enums) {
        prismaSchema += this.generateEnum(enumDef);
        prismaSchema += '\n\n';
      }
    }

    // Generate models
    for (const model of schema.models) {
      prismaSchema += this.generateModel(model);
      prismaSchema += '\n\n';
    }

    return prismaSchema;
  }

  /**
   * Generate enum definition
   */
  private static generateEnum(enumDef: { name: string; values: string[] }): string {
    return `enum ${enumDef.name} {
${enumDef.values.map(v => `  ${v}`).join('\n')}
}`;
  }

  /**
   * Generate model definition
   */
  private static generateModel(model: SchemaModel): string {
    let modelDef = `model ${model.name} {\n`;

    // Add fields
    for (const field of model.fields) {
      modelDef += this.generateField(field);
      modelDef += '\n';
    }

    // Add indexes
    if (model.indexes && model.indexes.length > 0) {
      modelDef += '\n';
      for (const index of model.indexes) {
        modelDef += `  @@index([${index}])\n`;
      }
    }

    modelDef += '}';
    return modelDef;
  }

  /**
   * Generate field definition
   */
  private static generateField(field: SchemaField): string {
    let fieldDef = `  ${field.name}`;
    
    // Type
    fieldDef += ` ${field.type}`;
    
    // Optional/Required
    if (!field.required) {
      fieldDef += '?';
    }
    
    // Unique
    if (field.unique) {
      fieldDef += ' @unique';
    }
    
    // Default
    if (field.default) {
      fieldDef += ` @default(${field.default})`;
    }
    
    // Relations
    if (field.relation) {
      fieldDef += ` @relation("${field.relation}")`;
    }

    return fieldDef;
  }

  /**
   * Generate TypeScript types from schema
   */
  static generateTypeScript(schema: DatabaseSchema): string {
    let tsTypes = '';

    // Generate enums
    if (schema.enums && schema.enums.length > 0) {
      for (const enumDef of schema.enums) {
        tsTypes += `export enum ${enumDef.name} {\n`;
        tsTypes += enumDef.values.map(v => `  ${v} = '${v}'`).join(',\n');
        tsTypes += '\n}\n\n';
      }
    }

    // Generate interfaces
    for (const model of schema.models) {
      tsTypes += this.generateInterface(model);
      tsTypes += '\n\n';
    }

    return tsTypes;
  }

  /**
   * Generate TypeScript interface
   */
  private static generateInterface(model: SchemaModel): string {
    let interfaceDef = `export interface ${model.name} {\n`;

    for (const field of model.fields) {
      const tsType = this.convertPrismaTypeToTS(field.type);
      const optional = !field.required ? '?' : '';
      interfaceDef += `  ${field.name}${optional}: ${tsType};\n`;
    }

    interfaceDef += '}';
    return interfaceDef;
  }

  /**
   * Convert Prisma type to TypeScript type
   */
  private static convertPrismaTypeToTS(prismaType: string): string {
    const typeMap: Record<string, string> = {
      'String': 'string',
      'Int': 'number',
      'Float': 'number',
      'Boolean': 'boolean',
      'DateTime': 'Date',
      'Json': 'any',
    };

    return typeMap[prismaType] || 'any';
  }

  /**
   * Generate migration SQL
   */
  static generateMigrationSQL(schema: DatabaseSchema, previousSchema?: DatabaseSchema): string {
    let sql = '-- Generated migration\n\n';

    if (!previousSchema) {
      // Initial migration - create all tables
      for (const model of schema.models) {
        sql += this.generateCreateTableSQL(model);
        sql += '\n\n';
      }
    } else {
      // Diff migration - compare schemas
      sql += '-- Schema changes would go here\n';
      sql += '-- (Simplified for demo - full diff implementation would be more complex)\n';
    }

    return sql;
  }

  /**
   * Generate CREATE TABLE SQL
   */
  private static generateCreateTableSQL(model: SchemaModel): string {
    let sql = `CREATE TABLE "${model.name}" (\n`;

    const fieldDefs = model.fields.map(field => {
      let def = `  "${field.name}" `;
      
      // SQL type
      const sqlType = this.convertPrismaTypeToSQL(field.type);
      def += sqlType;
      
      // NOT NULL
      if (field.required) {
        def += ' NOT NULL';
      }
      
      // UNIQUE
      if (field.unique) {
        def += ' UNIQUE';
      }
      
      // DEFAULT
      if (field.default) {
        def += ` DEFAULT ${field.default}`;
      }
      
      return def;
    });

    sql += fieldDefs.join(',\n');
    sql += '\n);';

    return sql;
  }

  /**
   * Convert Prisma type to SQL type
   */
  private static convertPrismaTypeToSQL(prismaType: string): string {
    const typeMap: Record<string, string> = {
      'String': 'TEXT',
      'Int': 'INTEGER',
      'Float': 'REAL',
      'Boolean': 'BOOLEAN',
      'DateTime': 'TIMESTAMP',
      'Json': 'JSONB',
    };

    return typeMap[prismaType] || 'TEXT';
  }

  /**
   * Generate API routes for CRUD operations
   */
  static generateCRUDRoutes(modelName: string): { [key: string]: string } {
    const routes: { [key: string]: string } = {};

    // GET (list)
    routes['GET'] = `import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const items = await prisma.${modelName.toLowerCase()}.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error('Failed to fetch items:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}`;

    // POST (create)
    routes['POST'] = `export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    
    const item = await prisma.${modelName.toLowerCase()}.create({
      data: {
        ...body,
        userId: session.user.id,
      },
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error('Failed to create item:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}`;

    // PUT (update)
    routes['PUT'] = `export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { id, ...data } = body;
    
    const item = await prisma.${modelName.toLowerCase()}.update({
      where: { id },
      data,
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error('Failed to update item:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}`;

    // DELETE
    routes['DELETE'] = `export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }
    
    await prisma.${modelName.toLowerCase()}.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete item:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}`;

    return routes;
  }

  /**
   * Validate schema
   */
  static validateSchema(schema: DatabaseSchema): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check for duplicate model names
    const modelNames = new Set<string>();
    for (const model of schema.models) {
      if (modelNames.has(model.name)) {
        errors.push(`Duplicate model name: ${model.name}`);
      }
      modelNames.add(model.name);

      // Validate fields
      const fieldNames = new Set<string>();
      for (const field of model.fields) {
        if (fieldNames.has(field.name)) {
          errors.push(`Duplicate field name in ${model.name}: ${field.name}`);
        }
        fieldNames.add(field.name);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

export default SchemaGenerator;
