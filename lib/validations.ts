import { z } from 'zod'

// ===============================
// Generic validate helper
// Preserves Zod OUTPUT typing so defaults are reflected in TS
// ===============================
export function validate<S extends z.ZodTypeAny>(schema: S, data: unknown):
  | { success: true; data: z.output<S> }
  | { success: false; errors: string[] } {
  const parsed = schema.safeParse(data)
  if (parsed.success) {
    return { success: true, data: parsed.data }
  }
  return {
    success: false,
    errors: parsed.error.issues.map(i => i.message),
  }
}

// ===============================
// Schemas
// ===============================
export const dealSchema = z.object({
  clientName: z.string().min(1),
  clientEmail: z.string().email(),
  clientPhone: z.string().min(1),
  dealType: z.enum(['buying', 'selling']).default('buying'),
  propertyAddress: z.string().min(1),
  price: z.number().positive(),
  transactionStage: z.number().min(1).max(8).default(1),
  keyDates: z.record(z.string()).default({}),
  notes: z.string().optional(),
  isActive: z.boolean().default(true),
  propertyId: z.string().optional(),
})

export type DealInput = z.input<typeof dealSchema>
export type DealOutput = z.output<typeof dealSchema>
