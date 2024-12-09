import { initialize } from './DBManager';


// eslint-disable-next-line import/prefer-default-export
let db;

export const initDBFile = (path) => {
  db = initialize(path)
}
export const dropHistoryTable = () => {
  const dropSql = `drop table history`;
  db.exec(dropSql);
};

export const createHistoryTable = () => {
  const createTableSql = `
    create table if not exists history(
      create_dttm TEXT primary key,
      action TEXT,
      json_string TEXT 
    )
  `;
  db.exec(createTableSql);
};

export const showNow = () => {     
  try {
    const stmt = db.prepare("select datetime('now', 'subsecond', 'localtime')");
    const result = stmt.get();
    return result;
  } catch(err) {
    console.error(err);
    throw err;
  }
};

export const deleteHistory = (createDttm) => {
  try {
    const stmt = db.prepare('delete from history where create_dttm = ?');
    const result = stmt.run(createDttm);
    return result;
  } catch(err) {
    console.error(err);
    throw err;
  }
}

export const deleteAllHistory = () => {
  try {
    const stmt = db.prepare('delete from history');
    const result = stmt.run();
    return result;
  } catch(err) {
    console.error(err);
    throw err;
  }
}

export const insertHistory = (action = 'none', value = '{}') => {
  try {
    const stmt = db.prepare(
      "insert into history values(datetime('now', 'subsecond', 'localtime'), ?, ?)",
    );
    const result = stmt.run(action, value);
    return result;
  } catch(err) {
    console.error(err);
    throw err;
  }
}

export const selectAll = () => {
  try {
    const stmt = db.prepare('select * from history order by create_dttm desc');
    const result = stmt.all();
    return result;
  } catch(err) {
    console.error(err); 
    throw err;
  }
}

export const selectByDateUnit = (unit = 'W') => {
  try {
    const whereClauses = {
      W: '-7 days',
      M: '-1 month',
      Y: '-1 year',
      F: '-10 year'
    }
    const stmt = db.prepare(
      `select * from history where create_dttm >= date('now', ?) order by create_dttm desc`,
    );
    const result = stmt.all(whereClauses[unit]);
    return result;
  } catch(err) {
    console.error(err); 
    throw err;
  }
}

export const selectAllAsJson = () => {
  try {
    const stmt = db.prepare(
      "select *, JSON_QUERY(json_string, '$.title, $.url, $.cctvId') from history",
    );
    const result = stmt.all();
    return result;
  } catch(err) {
    console.error(err); 
    throw err;
  }
}