import { useMemo, useState } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_ColumnFiltersState,
  type MRT_PaginationState,
  type MRT_SortingState,
} from 'material-react-table';
import { getApiUrl } from 'config/url';
import {
  QueryClient,
  QueryClientProvider,
  keepPreviousData,
  useQuery,
} from '@tanstack/react-query'; //note: this is TanStack React Query V5
import { IconButton, Tooltip } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

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
  //manage our own state for stuff we want to pass to the API
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([],);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });  
  
  //consider storing this code in a custom hook (i.e useFetchUsers)
  const {
    data: { items = [], metaData } = {}, //your data and api response will probably be different
    isError,
    isRefetching,
    isLoading,
    refetch,
  } = useQuery<BookApiResponse>({
    queryKey: [
      'table-data',
      columnFilters, //refetch when columnFilters changes
      globalFilter, //refetch when globalFilter changes
      pagination.pageIndex, //refetch when pagination.pageIndex changes
      pagination.pageSize, //refetch when pagination.pageSize changes
      sorting, //refetch when sorting changes
    ],
    queryFn: async () => {
      const url = new URL(
        'book', getApiUrl(),
      );
    
      // URL e.g. api/book?PageNumber=0&pageSize=10&title=long&author=nick&globalFilter=&OrderBy=author+asc

      url.searchParams.set('pageNumber', `${pagination.pageIndex}`);
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

      if (sorting && sorting.length > 0) {
        let showDescAsc = sorting[0].desc ? "desc" : "asc";
        url.searchParams.set('orderBy', `${sorting[0].id}` + " " + showDescAsc);
      }

      const response = await fetch(url.href);
      const json = (await response.json()) as BookApiResponse;
      return json;
    },
    placeholderData: keepPreviousData, //don't go to 0 rows when refetching or paginating to next page
  });

  const columns = useMemo<MRT_ColumnDef<Book>[]>(
    () => [
      {
        accessorKey: 'title',
        header: 'Title'
      },
      {
        accessorKey: 'author',
        header: 'Author'
      },
      {
        accessorKey: 'category.name',
        header: 'Category',
      },
      {
        accessorKey: 'note',
        header: 'Note'
      }
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data: items,
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
    renderTopToolbarCustomActions: () => (
      <Tooltip arrow title="Refresh Data">
        <IconButton onClick={() => refetch()}>
          <RefreshIcon />
        </IconButton>
      </Tooltip>
    ),
    rowCount: metaData?.totalCount,
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

const queryClient = new QueryClient();

const BookListQueryProvider = () => (
  //App.tsx or AppProviders file. Don't just wrap this component with QueryClientProvider! Wrap your whole App!
  <QueryClientProvider client={queryClient}>
    <BookList />
  </QueryClientProvider>
);

export default BookListQueryProvider;