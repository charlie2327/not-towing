import React, {useCallback, useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {decryptToken, getDataCarrier, validateAviableTime} from "../../services";
import dayjs from "dayjs";
import {availableTimes, columnsTableAppointment, headerTable} from "../../utils";
import {Button, Card, Col, DatePicker, Divider, Input, Row, Space, Table, Typography} from "antd";
import matusColor from "../../assets/matuscolor.png";

const { Text } = Typography;

const TransportPage = () => {
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [dataLotAndDateTimes, setDataLotAndDateTimes] = useState([]);

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
  const [isLoaded, setIsLoaded] = useState(true);
  const [isLoadedTime, setIsLoadedTime] = useState(false);
  const location = useLocation();

  const queryParam = new URLSearchParams(location.search);
  const token = queryParam.get("token");
  const [dataSource, setDataSource] = useState([]);
  const [nextLote, setNextLote] = useState(null);

  const [availableTimes, setAvailableTimes] = useState([]);

  useEffect(() => {
    if (token) {
      decryptToken(token)
        .then((dataDecrypt) => {
          const { status, data } = dataDecrypt;
          const [lote, idCarrier, type, idOrigin] = data.split(":");

          setTokenDecrypted({
            status,
            lote,
            idCarrier,
            type,
            idOrigin,
          });

          const list = [{ key: 1, lote }];
          setDataSource([...list]);

          setError({
            status: false,
            messageErrorDecrypt: null,
          });
        })
        .catch((error) => {
          setError({
            status: true,
            messageErrorDecrypt: error.message,
          });
        })
        .finally(() => {
          setIsLoaded(false);
        });
    } else {
      navigate('/not-found');
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
          setError({
            status: true,
            messageErrorDataCarrier: error.message,
          });
        })
        .finally(() => {
          setIsLoaded(false);
        });
    }
  }, [tokenDecrypted]);

  useEffect(() => {
    if (!tokenDecrypted.status) return;
    if (selectedDate) {
      setIsLoadedTime(true);
      const dateNumber = dayjs(selectedDate).valueOf();

      validateAviableTime(tokenDecrypted.idOrigin, dateNumber)
        .then((dataTime) => {
          const { status, list } = dataTime;

          if (status) {
            setAvailableTimes(list);
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
      setAvailableTimes([]);
    }
  }, [selectedDate, tokenDecrypted]);

  const onSelectedTime = (time) => {
    if (selectedTimes.includes(time)) {
      setSelectedTimes(selectedTimes.filter((item) => item !== time));
    } else {
      setSelectedTimes([...selectedTimes, time]);
    }
  };

  const addLot = () => {
    if (numberLote) {
      setDataSource([
        ...dataSource,
        { key: dataSource.length + 1, lote: numberLote },
      ]);
      setNumberLote(null);
      getNextLote();
    }
  };


  const getNextLote = useCallback(() => {
    const lote = dataSource.find((item) => {
      return !dataLotAndDateTimes.find(
        (itemData) => itemData.lote === item.lote
      );
    });
    setNextLote(lote);
  }, [dataSource, dataLotAndDateTimes]);

  const columns = headerTable(setDataSource, setSelectedTimes, setDataLotAndDateTimes, dataLotAndDateTimes);
  const columnsAppointment = columnsTableAppointment(setSelectedTimes, setDataLotAndDateTimes, dataLotAndDateTimes);

  useEffect(() => {
    if (dataSource.length > 0) {
      getNextLote();
    }
  }, [dataSource, dataLotAndDateTimes, nextLote, setNextLote, getNextLote]);

  const addLoteDateAndTime = (lote, date, time) => {
    setDataLotAndDateTimes([
      ...dataLotAndDateTimes,
      {
        lote,
        fecha: `${date.format("DD/MM/YYYY")} at ${time}`,
      },
    ]);
  };

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
          {/* Carrier Information */}
          <Col xs={24} sm={24} md={8} lg={6}>
            <Card
              loading={isLoaded}
              bordered
              title="Carrier Information"
              footer={
                <Text type="danger">{error.messageErrorDataCarrier}</Text>
              }
            >
              <Text strong>Company Name:</Text>
              <p>{dataCarrier?.nomComp || "N/A"}</p>
              <Text strong>Driver's Name:</Text>
              <p>{dataCarrier?.contacto || "N/A"}</p>
              <Text strong>Phone:</Text>
              <p>{dataCarrier?.telefono || "N/A"}</p>
              <Text strong>Email:</Text>
              <p>{dataCarrier?.email || "N/A"}</p>
            </Card>
          </Col>

          {/* Appointment Information */}
          <Col xs={24} sm={24} md={12} lg={12}>
            <Card bordered title="Appointment Information" loading={isLoaded}>
              <Space
                direction="vertical"
                size="middle"
                style={{ width: "100%" }}
              >
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
                <Text strong>Lot list:</Text>
                {/* agregar una nota */}

                {/* <Input.TextArea
                  placeholder="Description of the load"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                /> */}
                <Space.Compact style={{ width: "100%" }}>
                  <Input
                    placeholder="Number of lots"
                    value={numberLote}
                    onChange={(e) => setNumberLote(e.target.value)}
                  />
                  <Button
                    type="primary"
                    onClick={addLot}
                    disabled={dataSource.length === 5}
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

                {error.status && (
                  <Text type="danger">{error.messageErrorTime}</Text>
                )}
              </Space>
            </Card>
          </Col>

          {/* Time Selection */}
          <Col xs={24} sm={24} md={8} lg={6}>
            <Card
              bordered
              title={
                <div style={{ textAlign: "center" }}>
                  <Text strong>Select a time for the batch:</Text>
                  <br />

                  {nextLote?.lote ? (
                    <Text type="success">{nextLote.lote}</Text>
                  ) : (
                    <Text type="danger">No more lots available</Text>
                  )}
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
                  overflowY: availableTimes.length > 4 ? "scroll" : "hidden",
                  maxHeight: availableTimes.length > 4 ? "250px" : "auto",
                  padding: "10px",
                }}
              >
                {availableTimes.map((time) => {
                  return (
                    <Button
                      key={time}
                      type={'dashed'}
                      onClick={() => {
                        onSelectedTime(time);
                        addLoteDateAndTime(nextLote.lote, selectedDate, time);
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
        </Row>

        {/* Selected Appointment Summary */}
        {selectedDate && selectedTimes?.length > 0 && (
          <Card style={{ marginTop: 20, textAlign: "center" }}>
            <Text strong>Selected Appointment:</Text>
            {/* <p>
              {selectedDate.format("DD/MM/YYYY")} at {selectedTimes.join(", ")}
            </p>
            <Button type="primary">Confirm Appointment</Button> */}
            <Table
              columns={columnsAppointment}
              dataSource={dataLotAndDateTimes}
              pagination={false}
              bordered
            />
          </Card>
        )}
      </Card>
    </div>
  );
}

export default TransportPage;
