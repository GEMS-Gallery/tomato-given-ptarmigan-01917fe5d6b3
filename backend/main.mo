import Array "mo:base/Array";
import Hash "mo:base/Hash";
import Iter "mo:base/Iter";

import Blob "mo:base/Blob";
import Error "mo:base/Error";
import HashMap "mo:base/HashMap";
import Nat "mo:base/Nat";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Time "mo:base/Time";

actor {
  type File = {
    id: Nat;
    name: Text;
    content: Blob;
    size: Nat;
    createdAt: Time.Time;
  };

  stable var nextFileId: Nat = 0;
  let files = HashMap.HashMap<Nat, File>(0, Nat.equal, Nat.hash);

  public func uploadFile(name: Text, content: Blob): async Result.Result<Nat, Text> {
    let id = nextFileId;
    nextFileId += 1;

    let file: File = {
      id;
      name;
      content;
      size = Blob.toArray(content).size();
      createdAt = Time.now();
    };

    files.put(id, file);
    #ok(id)
  };

  public query func getFiles(): async [File] {
    Iter.toArray(files.vals())
  };

  public func deleteFile(fileId: Nat): async Result.Result<(), Text> {
    switch (files.remove(fileId)) {
      case null { #err("File not found") };
      case (?_) { #ok(()) };
    }
  };
}
