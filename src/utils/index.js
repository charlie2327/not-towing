import { Button } from "antd";

export const headerTable = (setDataSource, setSelectedTimes, setDataLotAndDateTimes, dataLotAndDateTimes) => [
  {
    title: "Index",
    dataIndex: "key",
  },
  {
    title: "Lote",
    dataIndex: "lote",
  },
  {
    title: "Actions",
    dataIndex: "actions",
    render: (text, record) => {
      // validar que si es el primer registro no se pueda eliminar
      if (record.key !== 1) {
        return (
          <Button
            type="primary"
            danger
            size="small"
            onClick={() => {
              setDataSource((prev) =>
                prev.filter((item) => item.key !== record.key)
              );


              const indexLote = dataLotAndDateTimes.findIndex((item) => item.lote === record.lote);

              // eliminar el time que pertenece a ese lote
              setSelectedTimes((prev) =>
                prev.filter((item, index) => index !== indexLote)
              );


              // eliminar en dependencia del lote
              setDataLotAndDateTimes((prev) =>
                prev.filter((item) => item.lote !== record.lote)
              );

            }}
          >
            Delete
          </Button>
        );
      }
    },
  },
];


export const columnsTableAppointment = (setSelectedTimes, setDataLotAndDateTimes, dataLotAndDateTimes) => [
  {
    title: "Lote",
    dataIndex: "lote",
  },
  {
    title: "Date and time",
    dataIndex: "fecha",
  },
  {
    title: "Actions",
    dataIndex: "actions",
    render: (text, record) => {
      return (
        <Button
          type="primary"
          danger
          size="small"
          onClick={() => {
            // buscar el index del lote en el array de lotes
            const indexLote = dataLotAndDateTimes.findIndex((item) => item.lote === record.lote);

            // eliminar el time que pertenece a ese lote
            setSelectedTimes((prev) =>
              prev.filter((item, index) => index !== indexLote)
            );
            // eliminar en dependencia del lote
            setDataLotAndDateTimes((prev) =>
              prev.filter((item) => item.lote !== record.lote)
            );

          }}
        >
          Delete
        </Button>
      );
    },
  },
];