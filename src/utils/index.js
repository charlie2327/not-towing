import { Button } from "antd";
export const availableTimes = [
  "7:00",
  "7:06",
  "7:12",
  "7:18",
  "7:24",
  "7:30",
  "7:36",
  "7:42",
  "7:48",
  "7:54",
  "8:00",
  "8:06",
  "8:12",
  "8:18",
  "8:24",
  "8:30",
  "8:36",
  "8:42",
  "8:48",
  "8:54",
  "9:00",
  "9:06",
  "9:12",
  "9:18",
  "9:24",
  "9:30",
  "9:36",
  "9:42",
  "9:48",
  "9:54",
  "10:00",
  "10:06",
  "10:12",
  "10:18",
  "10:24",
  "10:30",
  "10:36",
  "10:42",
  "10:48",
  "10:54",
  "11:00",
  "11:06",
  "11:12",
  "11:18",
  "11:24",
  "11:30",
  "11:36",
  "11:42",
  "11:48",
  "11:54",
  "12:00",
  "12:06",
  "12:12",
  "12:18",
  "12:24",
  "12:30",
  "12:36",
  "12:42",
  "12:48",
  "12:54",
  "13:00",
  "13:06",
  "13:12",
  "13:18",
  "13:24",
  "13:30",
  "13:36",
  "13:42",
  "13:48",
  "13:54",
  "14:00",
  "14:06",
  "14:12",
  "14:18",
  "14:24",
  "14:30",
  "14:36",
  "14:42",
  "14:48",
  "14:54",
  "15:00",
  "15:06",
  "15:12",
  "15:18",
  "15:24",
  "15:30",
  "15:36",
  "15:42",
  "15:48",
  "15:54",
  "16:00",
  "16:06",
  "16:12",
  "16:18",
  "16:24",
  "16:30",
  "16:36",
  "16:42",
  "16:48",
  "16:54",
];

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