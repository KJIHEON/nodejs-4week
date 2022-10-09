const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  nickname: String,
  password: String,
  confirm: String,
});
UserSchema.virtual("userId").get(function () {
  return this._id.toHexString();
});             // ObjectID 형태의 id를 24바이트의 hex 문자열로 바꾸어 리턴해주는 함수입니다.
UserSchema.set("toJSON", {
  virtuals: true,
});
module.exports = mongoose.model("User", UserSchema)