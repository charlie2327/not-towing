import "./App.css";
import React, { useState } from "react";
import {
  DatePicker,
  Button,
  Card,
  Typography,
  Space,
  Row,
  Col,
  Input,
  
} from "antd";
import dayjs, { Dayjs } from "dayjs";
import "antd/dist/reset.css";

const { Title, Text } = Typography;

const availableTimes = ["08:00", "08:15", "08:30", "08:45", "09:00"];

function App() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  return (
    <div style={{ maxWidth: "80%", margin: "auto", padding: 20 }}>
      <Card bordered>
        <Row gutter={16} align="middle">
          {/* Información de la Cita */}
          <Col span={6}>
            <Card>
              {/* agregar algo predeterminado como detalle */}
              <Title level={5}>Detalles de Transportista:</Title>
              <Text strong>Nombre de compañia:</Text>
              <p>Nombre de la Compañia</p>
              <Text strong>Nombre del conductor:</Text>
              <p>Apellido del Conductor</p>
              <Text strong>Telefono:</Text>
              <p>Telefono del Conductor</p>
              <Text strong> Email:</Text>
              <p>Email del Conductor</p>
            </Card>
          </Col>

          {/* Selección de Fecha */}
          <Col span={12}>
            <Card bordered>
              <Text strong>Cantidad</Text>
              <Input type="number" />
              <Text strong>Selecciona una fecha:</Text>
              <DatePicker
                onChange={(date) => setSelectedDate(date)}
                disabledDate={(current) =>
                  current && current < dayjs().startOf("day")
                }
                style={{ width: "100%" }}
                format="DD/MM/YYYY"
              />
              <Text strong>Descripción</Text>
              <Input.TextArea
                  type="textarea"

                placeholder="Descripción de la carga"
              />
            </Card>
          </Col>

          {/* Selección de Hora */}
          <Col span={6}>
            <Card bordered>
              <Title level={5}>Selecciona una hora:</Title>
              <Space direction="vertical" style={{ width: "100%" }}>
                {/* validar las horas en dependencia de la hora trasncurrida */}
                {availableTimes.map((time) => (
                  <Button
                    key={time}
                    type={selectedTime === time ? "primary" : "default"}
                    onClick={() => setSelectedTime(time)}
                    style={{
                      width: "100%",
                      textAlign: "center",
                      background: selectedTime === time ? "#1890ff" : "white",
                      color: selectedTime === time ? "white" : "black",
                    }}
                  >
                    {time}
                  </Button>
                ))}
              </Space>
            </Card>
          </Col>
        </Row>

        {/* Resumen de Cita Seleccionada */}
        {selectedDate && selectedTime && (
          <Card style={{ marginTop: 20, textAlign: "center" }}>
            <Text strong>Cita seleccionada:</Text>
            <p>
              {selectedDate.format("DD/MM/YYYY")} a las {selectedTime}
            </p>
            <Button type="primary">Confirmar Cita</Button>
          </Card>
        )}
      </Card>
    </div>
  );
}

export default App;
