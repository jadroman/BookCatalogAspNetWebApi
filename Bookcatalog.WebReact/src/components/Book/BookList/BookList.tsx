import { useEffect, useMemo, useState } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_ColumnFiltersState,
  type MRT_PaginationState,
  type MRT_SortingState,
} from 'material-react-table';

type Book = {
  id: number,
  title: string,
  author: string,
  category: Category,
  note: string
}

type Category = {
  id: number,
  name: string
}

type BookApiResponse = {
  items: Array<Book>;
  metaData: {
    totalCount: number;
  };
};

const BookList = () => {  
  //data and fetching state
  const [data, setData] = useState<Book[]>([]);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [rowCount, setRowCount] = useState(0);

  //table state
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>(
    [],
  );
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });  
  
  //if you want to avoid useEffect, look at the React Query example instead
  useEffect(() => {
    console.log('useEffect');
    const fetchData = async () => {
      if (!data.length) {
        setIsLoading(true);
      } else {
        setIsRefetching(true);
      }

      const url = new URL(
        '/api/book','https://localhost:5001',
      );

      // URL e.g. api/book?PageNumber=0&pageSize=10&title=long&author=nick&globalFilter=&sorting=[]

      url.searchParams.set('PageNumber', `${pagination.pageIndex}`);
      url.searchParams.set('pageSize', `${pagination.pageSize}`);
      
      columnFilters.forEach((cf) => {
        if(cf.id === 'title'){
          if(cf.value !== '' && typeof cf.value === 'string'){
            url.searchParams.set('title', cf.value)
          }
        }
        else if(cf.id === 'author'){
          if(cf.value !== '' && typeof cf.value === 'string'){
            url.searchParams.set('author', cf.value)
          }
        }
        else if(cf.id === 'category.name'){
          if(cf.value !== '' && typeof cf.value === 'string'){
            url.searchParams.set('category', cf.value)
          }
        }
        else if(cf.id === 'note'){
          if(cf.value !== '' && typeof cf.value === 'string'){
            url.searchParams.set('note', cf.value)
          }
        }
      })
      
      url.searchParams.set('globalFilter', globalFilter ?? '');
      url.searchParams.set('sorting', JSON.stringify(sorting ?? []));

      try {
        const response = await fetch(url.href);
        const json = (await response.json()) as BookApiResponse;
        setData(json.items);
        setRowCount(json.metaData.totalCount);
      } catch (error) {
        setIsError(true);
        console.error(error);
        return;
      }
      setIsError(false);
      setIsLoading(false);
      setIsRefetching(false);
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    columnFilters, //re-fetch when column filters change
    globalFilter, //re-fetch when global filter changes
    pagination.pageIndex, //re-fetch when page index changes
    pagination.pageSize, //re-fetch when page size changes
    sorting //re-fetch when sorting changes
  ]);

  const columns = useMemo<MRT_ColumnDef<Book>[]>(
    () => [
      {
        accessorKey: 'title',
        header: 'Title',
      },
      {
        accessorKey: 'author',
        header: 'Author',
      },
      {
        accessorKey: 'category.name',
        header: 'Category',
      },
      {
        accessorKey: 'note',
        header: 'Note',
      }
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data,
    enableRowSelection: true,
    getRowId: (row) => row.id?.toString(),
    initialState: { showColumnFilters: true },
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    muiToolbarAlertBannerProps: isError
      ? {
          color: 'error',
          children: 'Error loading data',
        }
      : undefined,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    rowCount,
    state: {
      columnFilters,
      globalFilter,
      isLoading,
      pagination,
      showAlertBanner: isError,
      showProgressBars: isRefetching,
      sorting,
    },
  });

    return <MaterialReactTable table={table} />;
}


export default BookList;