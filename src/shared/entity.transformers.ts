import { TransformFnParams } from "class-transformer"

export const decimalEntityColumnTransformer = {
    to: (value: string | number) => value,
    from: (value: string) => parseFloat(value)
}

export const toLowerCaseTransformer = ({ value }: TransformFnParams) => String(value).toLowerCase();

export const floatRounderTransformer = ({ value }: TransformFnParams) => parseFloat(parseFloat(value).toFixed(2));

export const removeDuplicatesTransformer = ({ value }: TransformFnParams) => Array.from(new Set(value));