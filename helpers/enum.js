exports.isEnum = ({ data, enums }) => {
  for (const en of enums) if (data === en) return true;
  return false;
};
