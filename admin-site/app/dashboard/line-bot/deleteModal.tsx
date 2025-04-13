import React, { useEffect, useRef } from "react";

export default function DeleteModal({
  isOpenModal,
  setIsOpenModal,
}: {
  isOpenModal: boolean;
  setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  // ---------------------------------------------
  // モーダル外をクリックした時の処理
  // ---------------------------------------------
  const modalRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        modalRef.current &&
        !(modalRef.current as HTMLElement).contains(event.target as Node)
      ) {
        setIsOpenModal(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalRef, setIsOpenModal]);

  // ---------------------------------------------
  // モーダル表示中: 背面のスクロールを禁止
  // ---------------------------------------------
  useEffect(() => {
    if (isOpenModal) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [isOpenModal]);

  return (
    <>
      {isOpenModal && (
        <div className="absolute z-10 top-0 left-0 w-full h-full bg-black bg-opacity-50">
          <div
            className="relative z-20 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-h-[95vh] md:max-h-[90vh] w-[97vw] md:w-[80vw] p-4 md:p-10 md:pb-20 bg-slate-100 border-neutral-950 shadow-lg rounded-xl overflow-auto"
            ref={modalRef}
          >
            <div className="flex flex-col items-center justify-center h-full">
              <h2 className="text-lg font-bold mb-4">Delete Confirmation</h2>
              <p className="mb-4">Are you sure you want to delete this item?</p>
              <div className="flex space-x-4">
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded"
                  onClick={() => {
                    // Handle delete action
                    console.log("Item deleted");
                    setIsOpenModal(false);
                  }}
                >
                  Delete
                </button>
                <button
                  className="bg-gray-300 text-black px-4 py-2 rounded"
                  onClick={() => setIsOpenModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
