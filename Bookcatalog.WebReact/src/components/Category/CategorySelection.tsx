import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import React, { useEffect } from "react";
import { CategorySelectionProps } from "types/props";


export default function CategorySelection(props: CategorySelectionProps): JSX.Element {
    const [selectedCategory, setSelectedCategory] = React.useState<string>(props.selectedCategory || '0');

    useEffect(() => {
        props.onSelectCategory(selectedCategory);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCategory]);

    const selectHandleChange = (event: SelectChangeEvent) => {
        const selectedValue = event.target.value as string
        setSelectedCategory(selectedValue);
    };

    const menuItems = props.inputData.map(i => <MenuItem id={i.id.toString()} key={i.id} value={i.id}>{i.name}</MenuItem>)

    return (
        <Select
            labelId="category"
            id="category"
            value={selectedCategory}
            label="category"
            onChange={selectHandleChange}
        >
            <MenuItem key='0' value='0'>- Choose a category -</MenuItem>
            {menuItems}
        </Select>
    )
}