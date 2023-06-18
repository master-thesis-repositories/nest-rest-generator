
// Types
type StringType = string;
type ObjType = {
  a: string;
  b: {
    c: StringType;
  };
};

// Variables
const a = "example";

const b: string | number = "example";

const c: StringType = "";

const d: ObjType = {
  a: "",
  b: {
    c: "",
  }
};

const e: {a: string, b: {a: StringType, b: ObjType}} = {
  a: "test",
  b: {a: "", b: {  a: "",
      b: {
        c: "",
      }}},
}

