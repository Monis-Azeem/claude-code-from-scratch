import z, { email } from "zod"

const filePathSchema = z.object({
    file_path: z.string().optional(),
    content: z.string().optional(), //TODO: can be controlled based on name value from toolCallSchema
    command: z.string().optional()  //TODO: can be controlled based on name value from toolCallSchema
})

export const toolCallSchema = z.object({
    name: z.string(), //TODO: can be enum
    arguments: z.string().transform((str) => JSON.parse(str)).pipe(filePathSchema)
})
