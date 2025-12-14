import './FormModal.css';

function FormModal({ isOpen, title, onClose, onSubmit, children }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="form-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="form-modal-header">
          <h2 className="form-modal-title">{title}</h2>
          <button className="form-modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={onSubmit} className="form-modal-form">
          {children}
          <div className="form-modal-actions">
            <button type="button" className="form-modal-button form-modal-button-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="form-modal-button form-modal-button-submit">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FormModal;
