import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Componente para el diálogo de confirmación de eliminación
export const DeleteConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>¿Eliminar recurso?</DialogTitle>
        <DialogDescription>
          ¿Estás seguro de que deseas eliminar este recurso? Esta acción no se
          puede deshacer.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="destructive" onClick={onConfirm}>
          Eliminar
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
