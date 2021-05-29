import React from 'react';
import { AtomData, AtomiAtomContainer, CacheContainer, ReadQueryOutput } from './types';

interface MyProps {
  url: string;
}

const initialCache: CacheContainer = {
  url: '',
  // eslint-disable-next-line no-unused-vars
  readQuery: (arg1: string) => ({ data: {}, writeAtom: () => { } }),
  // eslint-disable-next-line no-unused-vars
  setCache: (arg1: string, arg2: AtomiAtomContainer) => { },
  cache: {}
}

export const AppContext = React.createContext(initialCache)

export default class AtomiProvider extends React.Component<MyProps> {
  cacheContainer: CacheContainer;

  constructor(props: MyProps) {
    super(props);
    const { url } = this.props;
    const cacheContainer: CacheContainer = {
      url,
      setCache: this.setCache,
      readQuery: this.readQuery,
      cache: {}
    }
    this.cacheContainer = cacheContainer;
  }

  setCache = (query: string, atomiAtomContainer: AtomiAtomContainer) => {
    this.cacheContainer.cache = {
      ...this.cacheContainer.cache,
      [query]: atomiAtomContainer
    }
  }

  writeQuery = (query: string, newData: any) => {
    const atomiAtomContainer = this.cacheContainer.cache[query];
    const { atomData, writeAtom } = atomiAtomContainer
    atomData.data = newData;
    writeAtom((oldAtomData: AtomData) => ({
      ...oldAtomData,
      data: newData,
    })
    )
  }

  readQuery = (query: string): ReadQueryOutput => {
    const atomiAtomContainer = this.cacheContainer.cache[query];
    if (!atomiAtomContainer) throw new Error('Query not cached');
    const { atomData: { data } } = atomiAtomContainer;
    const writeAtom = (newData: any) => this.writeQuery(query, newData);
    return {
      data,
      writeAtom
    }
  }

  render() {
    const { children } = this.props;
    return (
      <AppContext.Provider value={this.cacheContainer}>
        {children}
      </AppContext.Provider>
    );
  }
}
