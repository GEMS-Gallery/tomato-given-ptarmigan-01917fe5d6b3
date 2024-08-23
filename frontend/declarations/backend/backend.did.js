export const idlFactory = ({ IDL }) => {
  const Result_1 = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  const Time = IDL.Int;
  const File = IDL.Record({
    'id' : IDL.Nat,
    'content' : IDL.Vec(IDL.Nat8),
    'name' : IDL.Text,
    'createdAt' : Time,
    'size' : IDL.Nat,
  });
  const Result = IDL.Variant({ 'ok' : IDL.Nat, 'err' : IDL.Text });
  return IDL.Service({
    'deleteFile' : IDL.Func([IDL.Nat], [Result_1], []),
    'getFiles' : IDL.Func([], [IDL.Vec(File)], ['query']),
    'uploadFile' : IDL.Func([IDL.Text, IDL.Vec(IDL.Nat8)], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
