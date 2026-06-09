type ConfirmDialogProps = {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
};

export function ConfirmDialog({
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
    onCancel
}: ConfirmDialogProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
                <h2 className="text-2xl font-bold text-gray-900">
                    {title}
                </h2>

                <p className="text-gray-600 mt-3">
                    {message}
                </p>

                <div className="flex justify-end gap-3 mt-6">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="rounded-lg bg-gray-200 text-gray-800 px-4 py-2 font-semibold hover:bg-gray-300"
                    >
                        {cancelText}
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        className="rounded-lg bg-red-700 text-white px-4 py-2 font-semibold hover:bg-red-800"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}