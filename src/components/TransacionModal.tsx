import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { useState, useEffect } from "react";
import type { Transacao } from "../types/types";
import { getMuiTheme } from "../styles/muiTheme";
import { createTransaction } from "../services/createTransaction";
import { editTransaction } from "../services/editTransaction";

type Props = {
  visible: boolean;
  onClose: () => void;
  onTransactionCreated: (t: Transacao) => void;
  transaction?: Transacao | null;
  isDarkMode?: boolean;
};

export function TransactionModal({
  visible,
  onClose,
  onTransactionCreated,
  transaction,
  isDarkMode = false,
}: Props) {
  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState("");
  const [valor, setValor] = useState<number>(0);
  const [tipo, setTipo] = useState<"entrada" | "saida">("entrada");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (transaction) {
      setDescricao(transaction.descricao || "");
      setCategoria(transaction.categoria || "");
      setValor(transaction.valor);
      setTipo(transaction.tipo);
    } else {
      setDescricao("");
      setCategoria("");
      setValor(0);
      setTipo("entrada");
    }
  }, [transaction]);

  const saveTransaction = async () => {
    setLoading(true);
    try {
      if (transaction) {
        // PATCH: apenas campos alterados
        const updatedData: Partial<Transacao> = {};
        if (descricao !== transaction.descricao)
          updatedData.descricao = descricao;
        if (categoria !== transaction.categoria)
          updatedData.categoria = categoria;
        if (valor !== transaction.valor) updatedData.valor = valor;
        if (tipo !== transaction.tipo) updatedData.tipo = tipo;

        if (Object.keys(updatedData).length === 0) {
          alert("Nenhuma alteração feita.");
          setLoading(false);
          return;
        }

        const updated = await editTransaction(transaction.id, updatedData);

        if (typeof updated === "string") {
          alert(`Erro ao editar: ${updated}`);
        } else {
          onTransactionCreated({
            ...transaction,
            ...updated,
          });
        }
      } else {
        // Criação
        const created = await createTransaction({
          descricao,
          categoria,
          valor,
          tipo,
        });

        if (typeof created === "string") {
          alert(`Erro ao criar: ${created}`);
        } else {
          onTransactionCreated(created);
        }
      }

      onClose();
    } catch (err) {
      console.error("Erro ao salvar transação:", err);
      alert("Erro inesperado ao salvar a transação.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={getMuiTheme(isDarkMode)}>
      <Dialog open={visible} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>
          {transaction ? "Editar" : "Adicionar"} Transação
        </DialogTitle>
        <DialogContent
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            marginTop: "0.5rem",
          }}
        >
          <TextField
            label="Descrição"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            fullWidth
          />
          <TextField
            label="Categoria"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            fullWidth
          />
          <TextField
            label="Valor"
            type="number"
            value={valor}
            onChange={(e) => setValor(Number(e.target.value))}
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel>Tipo</InputLabel>
            <Select
              value={tipo}
              label="Tipo"
              onChange={(e) => setTipo(e.target.value as "entrada" | "saida")}
            >
              <MenuItem value="entrada">Entrada</MenuItem>
              <MenuItem value="saida">Saída</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={saveTransaction}
            disabled={loading}
          >
            {transaction ? "Salvar" : "Adicionar"}
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}
