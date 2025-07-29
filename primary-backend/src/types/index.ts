

import { z } from "zod";

export const SignupSchema = z.object({
    name: z.string(),
    email: z.string(),
    password: z.string(),
})

export const LoginSchema = z.object({
    email: z.string(),
    password: z.string(),
})


export const ZapCreateSchema = z.object({
    availableTriggerId: z.string(),
    triggerMetadata: z.any().optional(),
    actions: z.array(z.object({
        availableActionId: z.string(),
        actionMetadata: z.any().optional(),
    }))
});