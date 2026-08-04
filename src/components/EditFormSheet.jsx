import { useEffect, useMemo, useState } from "react";
import ModalSheet from "./ModalSheet";
import EditableField from "./EditableField";
import { fieldLabel } from "../utils/fieldLabels";

export default function EditFormSheet({ title, open, values, fields, onSave, onClose }) {
  const initialValues = useMemo(() => {
    const next = {};
    fields.forEach((key) => { next[key] = values?.[key] ?? ""; });
    return next;
  }, [fields, values]);
  const [draft, setDraft] = useState(initialValues);

  useEffect(() => {
    if (open) setDraft(initialValues);
  }, [open, initialValues]);

  const dirty = fields.some((key) => String(draft[key] ?? "") !== String(initialValues[key] ?? ""));

  function requestClose() {
    if (dirty && !window.confirm("Discard your unsaved changes?")) return;
    onClose();
  }

  function save() {
    if (!dirty) return;
    onSave(draft);
    window.ftosToast?.("Changes saved");
    onClose();
  }

  const actions = (
    <div className="sheet-action-bar">
      <button type="button" className="secondary-button" onClick={requestClose}>Cancel</button>
      <button type="button" className="primary-button" disabled={!dirty} onClick={save}>Save Changes</button>
    </div>
  );

  return <ModalSheet title={title} open={open} onClose={requestClose} closeLabel="Cancel" footer={actions}>
    <div className="form-grid sheet-form">
      {fields.map((key) => <EditableField key={key} label={fieldLabel(key)} value={draft[key]} onChange={(value) => setDraft((current) => ({ ...current, [key]: value }))} />)}
    </div>
  </ModalSheet>;
}
