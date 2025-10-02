import { Device, DeviceSchema } from "./schemas/device.schema";
import { SetMenu, SetMenuSchema } from "./schemas/setMenu.schema";
import { SetModule, SetModuleSchema } from "./schemas/setModule.schema";
import { User, UserSchema } from "./schemas/user.schema";

interface TypeSchemas {
    name: any;
    schema: any;
}

export const Schemas:TypeSchemas[] = [
    { name: User.name, schema: UserSchema },
    { name: SetModule.name, schema: SetModuleSchema },
    { name: Device.name, schema: DeviceSchema },
    { name: SetMenu.name, schema: SetMenuSchema },
]