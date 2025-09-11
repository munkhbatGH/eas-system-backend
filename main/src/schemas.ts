import { User, UserSchema } from "./schemas/user.schema";

interface TypeSchemas {
    name: any;
    schema: any;
}

export const Schemas:TypeSchemas[] = [
    { name: User, schema: UserSchema },
]