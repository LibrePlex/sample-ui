import { AttributeValue } from "./group"


export const getAttrValue = (attr: AttributeValue) => {
    return !attr ? '' : attr.u8 ?  attr.u8.value
        : attr.i8 ?  attr.i8.value
        : attr.u16 ?  attr.u16.value
        : attr.i16 ?  attr.i16.value
        : attr.u32 ?  attr.u32.value
        : attr.i32 ?  attr.i32.value
        : attr.u64 ?  attr.u64.value.toString()
        : attr.i64 ?  attr.i64.value.toString()
        : attr.word ? attr.word.value
        : attr.none !== undefined ? '' : 'Invalid value' 
  }