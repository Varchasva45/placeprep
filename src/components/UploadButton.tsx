import { useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogTrigger, DialogContent } from "./ui/dialog";
import UploadDropzone from "./UploadDropzone";
import { useRecoilValue } from "recoil";
import userState from "../recoil/atoms/user";

const UploadButton = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const user = useRecoilValue(userState);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          setIsOpen(open);
        }
      }}
    >
      <DialogTrigger onClick={() => setIsOpen(true)}>
        <Button>Upload PDF</Button>
      </DialogTrigger>

      <DialogContent>
        <UploadDropzone isSubscribed={user.isSubscribed!} />
      </DialogContent>
    </Dialog>
  );
};

export default UploadButton;
