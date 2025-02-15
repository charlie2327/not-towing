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
    title: "# Lot",
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

export const steps = [
  {
    title: 'Select Date',
    content: 'First-content',
  },
  {
    title: 'Appointment Information',
    content: 'Second-content',
  },
  {
    title: 'Select a time for the batch',
    content: 'Third-content',
  },
  {
    title: 'Confirm the appointment',
    content: 'Last-content',
  }
];


export const parseDate = dateString => {
  // Dividir la fecha y la hora
  const [datePart, timePart] = dateString.split(" at ");

  // Extraer día, mes y año
  const [day, month, year] = datePart.split("/").map(Number);

  // Extraer hora y minutos
  const [hours, minutes] = timePart.split(":").map(Number);

  // Crear el objeto Date (meses en JS van de 0 a 11)
  return new Date(year, month - 1, day, hours, minutes);
}