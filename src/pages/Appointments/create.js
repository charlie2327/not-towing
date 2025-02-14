import React, { useState, useEffect } from "react";
import {
  DatePicker,
  Button,
  Card,
  Typography,
  Space,
  Row,
  Col,
  Input,
  Divider,
  Table,
  message,
  Steps,
  Badge,
} from "antd";
import dayjs from "dayjs";
import "antd/dist/reset.css";
import { useLocation } from "react-router-dom";
import {
  decryptToken,
  getDataCarrier,
  validateAviableTime,
  saveAppointment,
} from "../../services";
import { headerTable, columnsTableAppointment, steps, parseDate } from "../../utils";
import matusColor from "../../assets/matuscolor.png";
import NotFound from "../Errors/404";
const { Text } = Typography;

const CreateAppointment = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [dataLotAndDateTimes, setDataLotAndDateTimes] = useState([]);
  const [current, setCurrent] = useState(0);
  const next = () => {
    setCurrent(current + 1);
  };
  const prev = () => {
    setCurrent(current - 1);
  };
  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));

  const [tokenDecrypted, setTokenDecrypted] = useState({
    status: false,
    lote: null,
    idCarrier: null,
    type: null,
    idOrigin: null,
  });
  const [error, setError] = useState({
    status: false,
    messageErrorDecrypt: null,
    messageErrorDataCarrier: null,
    messageErrorTime: null,
  });
  const [dataCarrier, setDataCarrier] = useState(null);
  const [numberLote, setNumberLote] = useState(null);
  const [availableTimesFiltered, setAvailableTimesFiltered] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoadedTime, setIsLoadedTime] = useState(false);
  const location = useLocation();

  const queryParam = new URLSearchParams(location.search);
  const token = queryParam.get("token");
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    if (token && dataSource.length === 0) {
      decryptToken(token)
        .then((dataDescryp) => {
          const { status, data } = dataDescryp;
          console.log(data, "data");
          const [lote, idCarrier, idOrigin, interval] = data.split(":");
          console.log(lote, idCarrier, idOrigin, interval, "data Inicial");

          setTokenDecrypted({
            status,
            lote,
            idCarrier,
            interval,
            idOrigin,
          });
          //mandar el lote al array de data
          setDataSource([...dataSource, { key: 1, lote }]);
          setError({
            status: false,
            messageErrorDecrypt: null,
          });
        })
        .catch((error) => {
          console.error(error);
          setError({
            status: true,
            messageErrorDecrypt: error.message,
          });
        })
        .finally(() => {
          console.log("finally");
          setIsLoaded(false);
        });
    }
  }, [token, dataSource]);

  useEffect(() => {
    if (tokenDecrypted.status) {
      setIsLoaded(true);
      getDataCarrier(tokenDecrypted.idCarrier)
        .then((dataCarrier) => {
          const { data } = dataCarrier;
          setDataCarrier(data);
          setError({
            status: false,
            messageErrorDataCarrier: null,
          });
        })
        .catch((error) => {
          console.error(error);
          setError({
            status: true,
            messageErrorDataCarrier: error.message,
          });
        })
        .finally(() => {
          console.log("finally");
          setIsLoaded(false);
        });
    }
  }, [tokenDecrypted]);

  useEffect(() => {
    if (selectedDate) {
      setIsLoadedTime(true);
      const dateNumber = dayjs(selectedDate).valueOf();
      validateAviableTime(tokenDecrypted.idOrigin, dateNumber)
        .then((dataTime) => {
          const { status, list } = dataTime;

          if (status) {
            setAvailableTimesFiltered(list);
            setError({
              status: false,
              messageErrorTime: null,
            });
          }
        })
        .catch((error) => {
          console.error(error);
          setError({
            status: true,
            messageErrorTime: error.message,
          });
        })
        .finally(() => {
          console.log("finally");
          setIsLoadedTime(false);
        });
    } else {
      setAvailableTimesFiltered([]);
    }
  }, [selectedDate, tokenDecrypted]);

  const onSelectedTime = (time) => {
    // Verificar si el tiempo ya está seleccionado
    if (selectedTimes.includes(time)) {
      setSelectedTimes([]); // Deseleccionar todos los tiempos si ya está seleccionado
      setDataLotAndDateTimes([]); // Limpiar los tiempos seleccionados en dataLotAndDateTimes
      return;
    }

    // Obtener la cantidad de lotes
    const numLotes = dataSource.length;

    if (numLotes === 1) {
      // Si solo hay un lote, agregar el tiempo seleccionado
      setSelectedTimes([time]);
      // Agregar el tiempo a dataLotAndDateTimes
      setDataLotAndDateTimes([
        {
          lote: dataSource[0].lote, // Lote correspondiente
          fecha: `${selectedDate.format("DD/MM/YYYY")} at ${time}`,
        },
      ]);
    } else if (numLotes > 1) {
      // Si hay más de un lote, validar los tiempos siguientes
      const times = availableTimesFiltered;
      const index = times.indexOf(time);

      if (index === -1) {
        message.error("El tiempo seleccionado no está disponible.");
        return;
      }

      const interval = parseInt(tokenDecrypted.interval);

      // Verificar si hay suficientes tiempos disponibles para la cantidad de lotes
      if (index + numLotes > times.length) {
        message.error(
          "No hay suficientes tiempos disponibles para la cantidad de lotes."
        );
        return;
      }

      // Seleccionar los tiempos siguientes respetando el intervalo
      const selected = [time];
      let isValid = true;

      for (let i = 1; i < numLotes; i++) {
        const nextTime = times[index + i];
        const prevTime = selected[i - 1];

        // Calcular la diferencia en minutos entre los tiempos
        const diff = dayjs(nextTime, "HH:mm").diff(
          dayjs(prevTime, "HH:mm"),
          "minute"
        );

        if (diff !== interval) {
          isValid = false;
          break;
        }

        selected.push(nextTime);
      }

      if (isValid) {
        setSelectedTimes(selected);

        // Agregar los tiempos seleccionados a dataLotAndDateTimes
        const newDataLotAndDateTimes = selected.map((selectedTime, i) => ({
          lote: dataSource[i].lote, // Lote correspondiente según la posición
          fecha: `${selectedDate.format("DD/MM/YYYY")} at ${selectedTime}`,
        }));

        setDataLotAndDateTimes(newDataLotAndDateTimes);
      } else {
        message.error(
          "Los tiempos seleccionados no respetan el intervalo calculado."
        );
      }
    }
  };

  const addLot = () => {
    if (numberLote) {
      setDataSource([
        ...dataSource,
        { key: dataSource.length + 1, lote: numberLote },
      ]);
      setNumberLote(null);
    }
  };

  const columns = headerTable(
    setDataSource,
    setSelectedTimes,
    setDataLotAndDateTimes,
    dataLotAndDateTimes
  );
  const columnsAppointment = columnsTableAppointment(
    setSelectedTimes,
    setDataLotAndDateTimes,
    dataLotAndDateTimes
  );

  const contentSteps = [
    {
      content: (
        <Col xs={24} sm={24} md={24} lg={24}>
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <Text strong>Select a date:</Text>
            <DatePicker
              onChange={(date) => setSelectedDate(date)}
              disabledDate={(current) =>
                current && current < dayjs().startOf("day")
              }
              style={{ width: "100%" }}
              format="DD/MM/YYYY"
              value={selectedDate}
            />
          </Space>
        </Col>
      ),
    },
    {
      content: (
        <Col xs={24} sm={24} md={24} lg={24}>
          <Text strong>Lot list:</Text>
          <Space.Compact style={{ width: "100%", marginBottom: 10 }}>
            <Input
              placeholder="Number of lots"
              value={numberLote}
              onChange={(e) => setNumberLote(e.target.value)}
            />
            <Button
              type="primary"
              onClick={addLot}
              disabled={dataSource.length === 8}
            >
              Add Lot
            </Button>
          </Space.Compact>
          <Table
            columns={columns}
            dataSource={dataSource}
            pagination={false}
            bordered
          />

          {error.status && <Text type="danger">{error.messageErrorTime}</Text>}
        </Col>
      ),
    },
    {
      content: (
        <Col xs={24} sm={24} md={24} lg={24}>
          <Card
            bordered
            title={
              <div style={{ textAlign: "center" }}>
                <Text strong>Select a time for the batch:</Text>
                <br />
                <Space
                  size="middle"
                  style={{ marginTop: 10, marginBottom: 10 }}
                >
                  {dataSource.map((item) => {
                    return (
                      <Badge
                        key={item.lote}
                        style={{ backgroundColor: "#52c41a" }}
                        count={item.lote}
                      />
                    );
                  })}
                </Space>
              </div>
            }
            loading={isLoadedTime}
          >
            <Space
              direction="vertical"
              size="middle"
              style={{
                width: "100%",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(80px, 1fr))",
                gap: "5px",
                overflowY:
                  availableTimesFiltered.length > 4 ? "scroll" : "hidden",
                maxHeight: availableTimesFiltered.length > 4 ? "250px" : "auto",
                padding: "10px",
              }}
            >
              {availableTimesFiltered.map((time) => {
                const buttonType = selectedTimes.includes(time)
                  ? "primary"
                  : "default";

                return (
                  <Button
                    key={time}
                    type={buttonType}
                    onClick={() => {
                      onSelectedTime(time);
                    }}
                    style={{ width: "100%", textAlign: "center" }}
                  >
                    {time}
                  </Button>
                );
              })}
            </Space>
          </Card>
        </Col>
      ),
    },
    {
      content: (
        <Col xs={24} sm={24} md={24} lg={24}>
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <Text strong>Selected Appointment:</Text>
            <Table
              columns={columnsAppointment}
              dataSource={dataLotAndDateTimes}
              pagination={false}
              bordered
            />
          </Space>
        </Col>
      ),
    },
  ];

  const onSaveAppointment = () => {

    const data = {
        lotes: dataLotAndDateTimes.map((item) => {
            return {
                lote: item.lote,
                fecha: dayjs(parseDate(item.fecha)).format("YYYY-MM-DDTHH:mm:ss"),
            };
        }),
        token: token,
    }

    saveAppointment(data)
      .then((data) => {
        const { status } = data;
        if (status) {
          message.success("Appointment saved successfully.");
        } else {
          message.error("Error saving appointment.");
        }
      })
      .catch((error) => {
        message.error("Error saving appointment.");
      });
  };

  if (!token || error.messageErrorDecrypt) {
    return <NotFound />;
  }

  return (
    <div style={{ maxWidth: "90%", margin: "auto", padding: 20 }}>
      <Card bordered>
        {/* Header */}
        <Row justify="center">
          <Col span={24} style={{ textAlign: "center" }}>
            <img
              src={matusColor}
              alt="Matus"
              style={{ width: 200, maxWidth: "100%" }}
            />
          </Col>
        </Row>

        <Divider />

        <Row gutter={[16, 16]} justify="center">
          <Col xs={24} sm={24} md={24} lg={24}>
            <Card
              loading={isLoaded}
              bordered
              title="Carrier Information"
              footer={
                <Text type="danger">{error.messageErrorDataCarrier}</Text>
              }
            >
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={24} md={6} lg={6}>
                  <Text strong>Company Name:</Text>
                  <p>{dataCarrier?.nomComp || "N/A"}</p>
                </Col>
                <Col xs={24} sm={24} md={6} lg={6}>
                  <Text strong>Driver's Name:</Text>
                  <p>{dataCarrier?.contacto || "N/A"}</p>
                </Col>
                <Col xs={24} sm={24} md={6} lg={6}>
                  <Text strong>Phone:</Text>
                  <p>{dataCarrier?.telefono || "N/A"}</p>
                </Col>
                <Col xs={24} sm={24} md={6} lg={6}>
                  <Text strong>Email:</Text>
                  <p>{dataCarrier?.email || "N/A"}</p>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
        <Card bordered style={{ marginTop: 20 }}>
          <Steps current={current} items={items} />

          <Row
            style={{
              marginTop: 24,
            }}
            gutter={[16, 16]}
          >
            {contentSteps[current].content}
          </Row>
          <div
            style={{
              marginTop: 24,
              textAlign: "center",
            }}
          >
            {current > 0 && (
              <Button
                style={{
                  margin: "0 8px",
                }}
                onClick={() => prev()}
              >
                Previous
              </Button>
            )}
            {current < steps.length - 1 && (
              <Button type="primary" onClick={() => next()}>
                Next
              </Button>
            )}
            {current === steps.length - 1 && (
              <Button
                type="primary"
                onClick={() => onSaveAppointment()}
              >
                Done
              </Button>
            )}
          </div>
        </Card>
      </Card>
    </div>
  );
};

export default CreateAppointment;
