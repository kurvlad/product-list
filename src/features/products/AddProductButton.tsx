import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import type { ProductRow } from "./AddProductButton.interface";
import { useState } from "react";

const addProductSchema = z.object({
  name: z.string().min(1, "Введите наименование"),
  vendor: z.string().min(1, "Введите вендора"),
  sku: z.string().min(1, "Введите артикул"),
  price: z
    .string()
    .min(1, "Введите цену")
    .transform((value) => value.replace(/\s/g, "").replace(",", "."))
    .refine((value) => !Number.isNaN(Number(value)) && Number(value) > 0, {
      message: "Введите корректную цену",
    }),
});

type AddProductFormValues = z.infer<typeof addProductSchema>;

interface AddProductButtonProps {
  onProductAdded: (product: ProductRow) => void;
}

const AddProductButton: React.FC<AddProductButtonProps> = ({
  onProductAdded,
}) => {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddProductFormValues>({
    resolver: zodResolver(addProductSchema),
    defaultValues: {
      name: "",
      vendor: "",
      sku: "",
      price: "",
    },
    mode: "onChange",
  });

  const handleOpen = () => {
    reset();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit = (values: AddProductFormValues) => {
    const priceNumber = Number(values.price);

    const newProduct: ProductRow = {
      id: Date.now(),
      title: values.name.trim(),
      brand: values.vendor.trim(),
      sku: values.sku.trim(),
      rating: 5,
      price: priceNumber,
    };

    onProductAdded(newProduct);
    toast.success("Товар успешно добавлен");
    setOpen(false);
  };

  return (
    <>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={handleOpen}
        sx={{
          borderRadius: 3,
          textTransform: "none",
          fontWeight: 600,
          px: 2.5,
          backgroundColor: "#2f4cff",
          "&:hover": {
            backgroundColor: "#2238d4",
          },
        }}
      >
        Добавить
      </Button>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Добавить товар</DialogTitle>
        <DialogContent dividers>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
          >
            <TextField
              label="Наименование"
              fullWidth
              {...register("name")}
              error={Boolean(errors.name)}
              helperText={errors.name?.message}
            />
            <TextField
              label="Вендор"
              fullWidth
              {...register("vendor")}
              error={Boolean(errors.vendor)}
              helperText={errors.vendor?.message}
            />
            <TextField
              label="Артикул"
              fullWidth
              {...register("sku")}
              error={Boolean(errors.sku)}
              helperText={errors.sku?.message}
            />
            <TextField
              label="Цена, ₽"
              fullWidth
              {...register("price")}
              error={Boolean(errors.price)}
              helperText={errors.price?.message}
            />

            {Object.keys(errors).length > 0 && (
              <Typography color="error" variant="body2">
                Пожалуйста, исправьте ошибки формы.
              </Typography>
            )}

            <DialogActions sx={{ px: 0, pt: 1 }}>
              <Button onClick={handleClose}>Отмена</Button>
              <Button type="submit" variant="contained" disabled={isSubmitting}>
                Добавить
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddProductButton;
