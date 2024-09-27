import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`
const CCTV = styled.div`
  display: flex;
  font-size: 12px;
  font-weight: 100;
  color: yellow;
`
const Action = styled.div`
`
const Title = styled(Action)`
  margin-left: 3px;
  cursor: pointer;
  width: 100%;
  &:hover {
    color: white;
  };
`
const DelButton = styled(Action)`
  margin-left: 3px;
  color: red;
  margin-left: auto;
  font-weight: 200;
  cursor: pointer;
  &:hover {
    color: white;
  };
`
const ReloadButton = styled.button`
  margin-top: auto;
`

function HistoryShow(props) {
  const { setQuickUrl, setQuickTitle } = props;
  const [cctvHistory, setHistory] = React.useState([]);

  const handleLoadDone = React.useCallback((results) => {
    try {
      console.log('load done:', results);
      const cctvHistory = results.map((result) => {
        return {
          ...result,
          json: JSON.parse(result.json_string)
        }
      });
      console.log('cctvHistory:', cctvHistory);
      setHistory(cctvHistory)
    } catch(err) {
      console.error(err);
      setHistory([{ title: 'LOAD ERROR' }]);
    }
  }, []);

  const handleReloadNeeded = React.useCallback(() => {
    window.electron.ipcRenderer.sendMessage('loadHistoryDB');
  }, []);

  React.useEffect(() => {
    window.electron.ipcRenderer.on('reloadNeeded', handleReloadNeeded);
    window.electron.ipcRenderer.on('loadDone', handleLoadDone);
    return () => {
      window.electron.ipcRenderer.off('reloadNeeded', handleReloadNeeded);
      window.electron.ipcRenderer.off('loadDone', handleLoadDone);
    }
  }, [handleLoadDone, handleReloadNeeded]);

  const reloadHistory = React.useCallback(() => {
    window.electron.ipcRenderer.sendMessage('loadHistoryDB');
  }, []);

  const handleDelete = React.useCallback((event) => {
    const createDttm = event.target.id;
    window.electron.ipcRenderer.sendMessage('deleteHistory', createDttm);
  }, []);

  return (
    <Container>
      {cctvHistory.map((cctv) => (
        <CCTV key={cctv.json.cctvId}>
          <Action>[{cctv.action}]</Action>
          <Title>{cctv.json.title}</Title>
          <DelButton id={cctv.create_dttm} onClick={handleDelete}>[Del]</DelButton>
        </CCTV>
      ))}
      <ReloadButton onClick={reloadHistory}>refresh</ReloadButton>
    </Container>
  )
}

export default React.memo(HistoryShow);