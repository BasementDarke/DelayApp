import { ParameterKey } from "../objects/parameter.key";

export interface ParameterBlockDto {
    taskKey: number;
    parameters: Map<ParameterKey, string>;
}
