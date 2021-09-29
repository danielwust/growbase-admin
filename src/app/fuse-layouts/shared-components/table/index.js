import React from 'react';

import TableContent from './content';

export default function TableComponent({ columns, data, action }) {
	return <TableContent columns={columns} data={data} action={action} />;
}
