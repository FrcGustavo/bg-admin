import React, { useEffect, useMemo, useCallback } from 'react';
import { ToolsHeader, ClientForm } from '../../components/molecules';
import { Table } from '../../components/organisms';
import { LayoutAdmin } from '../../components/templates';
import { useStateValue } from '../../store/StateProvider';
import { addClients, addClient, openFormClient } from '../../store/actions';
import { getClients, saveClient, SCHEMA_CLIENT } from '../../localdata/clients';
import './styles.css';

const Clients = () => {
  const [{ clients, client }, dispatch] = useStateValue();

  const handleEdit = useCallback(
    (uid) => {
      const data = clients.data.filter((client) => client.uid === uid)[0];
      dispatch(openFormClient({ data, isOpenModal: true, error: false }));
    },
    [dispatch, clients.data]
  );

  const handleCloseModal = () => {
    dispatch(openFormClient({ data: false, isOpenModal: false }));
  };

  const handleNew = () => {
    dispatch(
      openFormClient({
        data: { ...SCHEMA_CLIENT },
        isOpenModal: true,
        error: false,
      })
    );
  };

  const handleSelectedRows = () => {};

  const handlePrint = () => {
    window.print();
  };

  const handleSendEmail = () => {
    alert('handleButtonSendEmail');
  };

  const handleSave = (data) => {
    const saveData = async () => {
      const uid = data.uid;
      const client = {
        code: data.code,
        name: data.name,
        address: data.address,
        phone: data.phone,
        email: data.email,
      };
      const savedClient = await saveClient(uid, client);
      dispatch(addClient({ uid, savedClient }));
      handleCloseModal();
    };
    saveData();
  };

  const columns = useMemo(
    () => [
      { Header: 'Codigo', accessor: 'code' },
      { Header: 'Nombre', accessor: 'name' },
      { Header: 'Dirección', accessor: 'address' },
      { Header: 'Telefono', accessor: 'phone' },
      { Header: 'Correo', accessor: 'email' },
      {
        accessor: 'uid',
        Cell: ({ value }) => (
          <button onClick={() => handleEdit(value)}>Editar</button>
        ),
      },
    ],
    [handleEdit]
  );

  const data = useMemo(() => clients.data, [clients.data]);

  useEffect(() => {
    const getData = async () => {
      dispatch(addClients({ data: false, loading: true, error: false }));

      let data = false;
      let error = false;

      try {
        data = await getClients();
      } catch (err) {
        error = err.message;
      }

      dispatch(addClients({ data, loading: false, error }));
      return data;
    };

    return !clients.data ? getData() : null;
  }, [dispatch, clients.data]);

  return (
    <LayoutAdmin title="Clientes">
      <div className="main clients">
        <ToolsHeader
          onNew={handleNew}
          onPrint={handlePrint}
          onSendEmail={handleSendEmail}
        />

        {clients.data && (
          <Table
            columns={columns}
            data={data}
            handleSelectedRows={handleSelectedRows}
          />
        )}
        {clients.loading && <p>Cargando</p>}
        {clients.error && <p>Error al cargar</p>}

        {client.isOpenModal && (
          <ClientForm
            client={client.data}
            close={handleCloseModal}
            save={handleSave}
          />
        )}
      </div>
    </LayoutAdmin>
  );
};

export default Clients;
