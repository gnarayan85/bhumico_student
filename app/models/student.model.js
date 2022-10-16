module.exports = mongoose => {
  var schema = mongoose.Schema(
      {
      studentId: Number,
      studentName: String,
      class: String,
      marks : String,
      pdf: String
    },
    { timestamps: true }
  );

  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Student = mongoose.model("student", schema);
    return Student;
};
