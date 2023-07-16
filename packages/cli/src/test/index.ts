
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

let b: string | number = a === "example" ? "example" : 3;

let x = b;

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

const f: {a: string}[] = [];

const g: Omit<ObjType, "a"> = {
  b: {c: ""}
};

