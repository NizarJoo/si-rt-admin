import Select from 'react-select';
export default function MultiSelect({
  options,
  value,
  onChange,
  placeholder,
  isMulti = true,
}) {
  return (
    <Select
      isMulti={isMulti}
      options={options}
      value={options.filter((opt) => value.includes(opt.value))}
      onChange={(selected) => onChange(selected.map((item) => item.value))}
      placeholder={placeholder}
      className="react-select-container"
      classNamePrefix="react-select"
    />
  );
}
