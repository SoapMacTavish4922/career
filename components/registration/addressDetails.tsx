"use client";

import { useState } from "react";
import { allowOnlyLetters, allowOnlyNumbers } from "@/lib/utils/keyboardHelpers";
import { AddressBlock } from "@/lib/types/registration";


interface Props {
  onNext: (data?: any) => void;
  onBack: () => void;
  defaultValues?: {
    permanentAddress?: AddressBlock;
    currentAddress?: AddressBlock;
    sameAsPermanent?: boolean;
  };
}

const emptyAddress = (): AddressBlock => ({
  line1: "",
  city: "",
  state: "",
  country: "",
  pinCode: "",
});

const Field = ({
  placeholder,
  value,
  onChange,
  error,
  onKeyDown,
  maxLength = 200,
  showCharCount = false,
  disabled = false,
}: {
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  maxLength?: number;
  showCharCount?: boolean;
  disabled?: boolean;
}) => (
  <div className="flex flex-col gap-0.5">
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      maxLength={maxLength}
      disabled={disabled}
      className={`border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 w-full
        ${disabled ? "bg-gray-100 cursor-not-allowed text-gray-500 border-gray-200" :
          error ? "border-red-400 focus:ring-red-300" : "border-gray-300 focus:ring-teal-400"
        }`}
    />
    <div className="flex justify-between items-center">
      {error ? <p className="text-xs text-red-500">{error}</p> : <span />}
      {showCharCount && !disabled && (
        <p className={`text-xs ${value.length >= maxLength ? "text-red-500" : "text-gray-400"}`}>
          {value.length}/{maxLength}
        </p>
      )}
    </div>
  </div>
);

const AddressSection = ({
  prefix,
  data,
  onChange,
  errors,
  disabled = false,
}: {
  prefix: string;
  data: AddressBlock;
  onChange: (field: keyof AddressBlock, value: string) => void;
  errors: Partial<Record<string, string>>;
  disabled?: boolean;
}) => (
  <div className="flex flex-col gap-3">
    {/* Line 1 */}
    <div className="flex flex-col gap-1">
      <label className="text-sm text-gray-700">
        Address Line 1 <span className="text-red-500">*</span>
      </label>
      <Field
        placeholder="123, MG Road"
        value={data.line1}
        onChange={(v) => onChange("line1", v)}
        error={errors[`${prefix}_line1`]}
        maxLength={200}
        showCharCount={true}
        disabled={disabled}
      />
    </div>

    {/* City + State */}
    <div className="flex gap-4">
      <div className="flex-1 flex flex-col gap-1">
        <label className="text-sm text-gray-700">
          City <span className="text-red-500">*</span>
        </label>
        <Field
          placeholder="eg: Pune"
          value={data.city}
          onChange={(v) => onChange("city", v)}
          onKeyDown={allowOnlyLetters}
          error={errors[`${prefix}_city`]}
          disabled={disabled}
        />
      </div>

      <div className="flex-1 flex flex-col gap-1">
        <label className="text-sm text-gray-700">
          State <span className="text-red-500">*</span>
        </label>
        <Field
          placeholder="eg: Maharashtra"
          value={data.state}
          onChange={(v) => onChange("state", v)}
          onKeyDown={allowOnlyLetters}
          error={errors[`${prefix}_state`]}
          disabled={disabled}
        />
      </div>
    </div>

    {/* Country + Pin Code */}
    <div className="flex gap-4">
      <div className="flex-1 flex flex-col gap-1">
        <label className="text-sm text-gray-700">
          Country <span className="text-red-500">*</span>
        </label>
        <Field
          placeholder="eg: India"
          value={data.country}
          onChange={(v) => onChange("country", v)}
          onKeyDown={allowOnlyLetters}
          error={errors[`${prefix}_country`]}
          disabled={disabled}
        />
      </div>

      <div className="flex-1 flex flex-col gap-1">
        <label className="text-sm text-gray-700">
          Pin Code <span className="text-red-500">*</span>
        </label>
        <Field
          placeholder="eg: 411001"
          value={data.pinCode}
          onChange={(v) => onChange("pinCode", v)}
          onKeyDown={allowOnlyNumbers}
          maxLength={6}
          error={errors[`${prefix}_pinCode`]}
          disabled={disabled}
        />
      </div>
    </div>
  </div>
);

export default function AddressDetails({ onNext, onBack, defaultValues }: Props) {
  const [current, setCurrent] = useState<AddressBlock>(
    defaultValues?.currentAddress ?? emptyAddress()
  );
  const [permanent, setPermanent] = useState<AddressBlock>(
    defaultValues?.permanentAddress ?? emptyAddress()
  );
  const [sameAsPermanent, setSameAsPermanent] = useState(
    defaultValues?.sameAsPermanent ?? false
  );
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});

  const validate = () => {
    const newErrors: Partial<Record<string, string>> = {};

    // Validate current address
    if (!current.line1.trim()) newErrors["curr_line1"] = "Line 1 is required";
    if (!current.city.trim()) newErrors["curr_city"] = "City is required";
    if (!current.state.trim()) newErrors["curr_state"] = "State is required";
    if (!current.country.trim()) newErrors["curr_country"] = "Country is required";
    if (!current.pinCode.trim()) newErrors["curr_pinCode"] = "Pin code is required";
    else if (!/^\d{6}$/.test(current.pinCode))
      newErrors["curr_pinCode"] = "Enter a valid 6-digit pin code";

    // Validate permanent only if not same as current
    if (!sameAsPermanent) {
      if (!permanent.line1.trim()) newErrors["perm_line1"] = "Line 1 is required";
      if (!permanent.city.trim()) newErrors["perm_city"] = "City is required";
      if (!permanent.state.trim()) newErrors["perm_state"] = "State is required";
      if (!permanent.country.trim()) newErrors["perm_country"] = "Country is required";
      if (!permanent.pinCode.trim()) newErrors["perm_pinCode"] = "Pin code is required";
      else if (!/^\d{6}$/.test(permanent.pinCode))
        newErrors["perm_pinCode"] = "Enter a valid 6-digit pin code";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCurrent = (field: keyof AddressBlock, value: string) => {
    setCurrent((prev) => ({ ...prev, [field]: value }));
    // if same address is on, keep permanent in sync
    if (sameAsPermanent) setPermanent((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => { const e = { ...prev }; delete e[`curr_${field}`]; return e; });
  };

  const handlePermanent = (field: keyof AddressBlock, value: string) => {
    setPermanent((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => { const e = { ...prev }; delete e[`perm_${field}`]; return e; });
  };

  const handleSameAsPermanent = (checked: boolean) => {
    setSameAsPermanent(checked);
    // pre-fill permanent from current when checked; reset when unchecked
    if (checked) setPermanent({ ...current });
    else setPermanent(emptyAddress());
  };

  const handleSubmit = () => {
    if (validate()) {
      onNext({
        currentAddress: current,
        permanentAddress: sameAsPermanent ? current : permanent,
        sameAsPermanent,
      });
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-1">Enter address details</h2>
      <p className="text-sm text-gray-500 mb-6">
        Enter your current and permanent address details here
      </p>

      <div className="flex flex-col gap-6">

        {/* ── Current Address (first) ── */}
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-gray-700">Current Address</h3>
          <AddressSection
            prefix="curr"
            data={current}
            onChange={handleCurrent}
            errors={errors}
          />
        </div>

        {/* ── Checkbox ── */}
        <label className="flex items-center gap-2 cursor-pointer w-fit">
          <input
            type="checkbox"
            checked={sameAsPermanent}
            onChange={(e) => handleSameAsPermanent(e.target.checked)}
            className="w-4 h-4 accent-orange-500"
          />
          <span className="text-sm text-gray-600">
            Current address is same as permanent address
          </span>
        </label>

        {/* ── Permanent Address (second, disabled when same) ── */}
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-gray-700">Permanent Address</h3>

          <AddressSection
            prefix="perm"
            data={sameAsPermanent ? current : permanent}
            onChange={handlePermanent}
            disabled={sameAsPermanent}        // ✅ grayed out when checkbox is on
            errors={errors}
          />
        </div>

      </div>

      {/* ── Actions ── */}
      <div className="flex gap-4 mt-8">
        <button
          className="flex-1 border border-gray-300 text-gray-600 text-sm font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors"
          onClick={onBack}
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          className="flex-1 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold py-3 rounded-xl transition-colors"
        >
          Save & Continue
        </button>
      </div>
    </div>
  );
}