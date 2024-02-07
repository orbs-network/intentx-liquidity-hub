import { ApolloClient, DocumentNode, NormalizedCacheObject } from '@apollo/client'

/**
 *
 * @param clients
 * @param query Query that must contain first and skip variables
 * @param vars
 * @returns
 */
export async function queryAllForClients<T>(
  clients: ApolloClient<NormalizedCacheObject>[],
  query: DocumentNode,
  vars: any
) {
  const result: T[] = []

  for (const client of clients) {
    let skip = 0
    let hasMore = true

    while (hasMore) {
      const newVariables = vars
      newVariables['first'] = 1000
      newVariables['skip'] = skip

      const { data } = await client.query({
        query,
        variables: newVariables,
        fetchPolicy: 'no-cache',
      })

      if (!data) {
        throw new Error(`Unable to query data from Client`)
      }

      // Getting the first key from data
      const key = Object.keys(data)[0]
      const queryData = data[key]

      if (queryData.length) {
        result.push(...queryData)
        skip += 1000
      } else {
        hasMore = false
      }
    }
  }

  return result
}

export async function queryForClients<T>(
  clients: ApolloClient<NormalizedCacheObject>[],
  query: DocumentNode,
  vars: any
) {
  const result: T[] = []

  for (const client of clients) {
    console.log('querying', client, query, vars)
    const { data } = await client.query({
      query,
      variables: vars,
      fetchPolicy: 'no-cache',
    })

    if (!data) {
      throw new Error(`Unable to query data from Client`)
    }

    // Getting the first key from data
    const key = Object.keys(data)[0]
    const queryData = data[key]

    result.push(...queryData)
  }

  return result
}
