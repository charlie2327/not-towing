import "./App.css";
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
  Alert,
  Divider,
} from "antd";
import dayjs from "dayjs";
import "antd/dist/reset.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { decryptToken, getDataCarrier, validateAviableTime } from "./services";
import { availableTimes } from "./utils";
import matusColor from "./assets/matuscolor.png";

const { Text } = Typography;

function TransportApp() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimes, setSelectedTimes] = useState([]);
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
  const [quantity, setQuantity] = useState(null);
  const [description, setDescription] = useState(null);
  const [availableTimesFiltered, setAvailableTimesFiltered] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoadedTime, setIsLoadedTime] = useState(false);
  const location = useLocation();

  const queryParam = new URLSearchParams(location.search);
  const token = queryParam.get("token");

  console.log(token, "token");

  useEffect(() => {
    if (token) {
      decryptToken(token)
        .then((dataDescryp) => {
          const { status, data } = dataDescryp;

          const [lote, idCarrier, type, idOrigin] = data.split(":");

          setTokenDecrypted({
            status,
            lote,
            idCarrier,
            type,
            idOrigin,
          });
          setDescription(lote);
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
  }, [token]);

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
      console.log(dateNumber, "dateNumber");
      validateAviableTime(tokenDecrypted.idOrigin, "1739173629000")
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
    if (selectedTimes.includes(time)) {
      setSelectedTimes(selectedTimes.filter((item) => item !== time));
    } else {
      setSelectedTimes([...selectedTimes, time]);
    }
  };

  return (
    <div style={{ maxWidth: "80%", margin: "auto", padding: 20 }}> 
      <Card bordered>

        {/* Header */}
        <Row justify="center">
          <Col span={24} style={{ textAlign: "center" }}>
            <img src={matusColor} alt="Matus" style={{ width: 200 }} />
          </Col>
        </Row>
        <Divider />
        <Row gutter={16} align="middle">
          {/* Carrier Information */}
          <Col span={6}>
            <Card
              loading={isLoaded}
              bordered
              title="Carrier Information"
              footer={
                <Text type="danger">{error.messageErrorDataCarrier}</Text>
              }
            >
              {" "}
              <Text strong>Company Name:</Text>
              <p>{dataCarrier?.nomComp ? dataCarrier.nomComp : "N/A"}</p>
              <Text strong>Driver's Name:</Text>
              <p>{dataCarrier?.contacto ? dataCarrier.contacto : "N/A"}</p>
              <Text strong>Phone:</Text>
              <p>{dataCarrier?.telefono ? dataCarrier.telefono : "N/A"}</p>
              <Text strong>Email:</Text>
              <p>{dataCarrier?.email ? dataCarrier.email : "N/A"}</p>
            </Card>
          </Col>

          {/* Date Selection */}
          <Col span={12}>
            <Card bordered title="Appointment Information" loading={isLoaded}>
              <Text strong>Quantity</Text>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
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
              <Text strong>Description</Text>
              <Input.TextArea
                type="textarea"
                placeholder="Description of the load"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <Space
                direction="vertical"
                size="middle"
                style={{ width: "100%" }}
              >
                {error.status && (
                  <Text type="danger">{error.messageErrorTime}</Text>
                )}
              </Space>
            </Card>
          </Col>

          {/* Time Selection */}
          <Col span={6}>
            <Card bordered title="Select a time" loading={isLoadedTime}>
              <Space
                direction="vertical"
                size="middle"
                style={{
                  width: "100%",
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "5px",
                  overflowY: availableTimes.length > 4 ? "scroll" : "hidden",
                  height: availableTimes.length > 4 ? "250px" : "auto",
                  padding: "10px",
                }}
              >
                {availableTimes.map((time) => {
                  let buttonType = "default";
                  if (!availableTimesFiltered.includes(time)) {
                    buttonType = "dashed";
                  } else if (selectedTimes.includes(time)) {
                    buttonType = "primary";
                  }

                  return (
                    <Button
                      disabled={!availableTimesFiltered.includes(time)}
                      key={time}
                      type={buttonType}
                      onClick={() => onSelectedTime(time)}
                      style={{
                        width: "100%",
                        textAlign: "center",
                      }}
                    >
                      {time}
                    </Button>
                  );
                })}
              </Space>
            </Card>
          </Col>
        </Row>

        {/* Selected Appointment Summary */}
        {selectedDate && selectedTimes?.length > 0 && (
          <Card style={{ marginTop: 20, textAlign: "center" }}>
            <Text strong>Selected Appointment:</Text>
            <p>
              {selectedDate.format("DD/MM/YYYY")} at {selectedTimes.join(", ")}
            </p>
            <Button type="primary">Confirm Appointment</Button>
          </Card>
        )}
      </Card>
    </div>
  );
}

// Configuración del enrutador
function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta principal para /transporte */}
        <Route path="/transporte" element={<TransportApp />} />
        {/* Redirigir la ruta raíz a /transporte */}
        <Route path="/" element={<Navigate to="/transporte" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
