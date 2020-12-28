import { useHarperDB } from 'use-harperdb';

import React from 'react'

const PlayerService = (props) => {
    let file = props.division
    const [data, loading, error, refresh] = useHarperDB({
        query: { operation: 'sql', sql: `select * from roster.${file}roster` },
      });
        return data
}

export default PlayerService


