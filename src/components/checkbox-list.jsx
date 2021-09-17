import { Checkbox } from '@chakra-ui/checkbox';
import { SimpleGrid } from '@chakra-ui/layout';
import { Popover, PopoverBody, PopoverContent, PopoverTrigger } from '@chakra-ui/popover';
import React from 'react';

// todo:
const CheckBoxList = ({ items = [], ...props }) => {
    return items.map(({ title, isChecked, items = [], onClick, onChange, onHover, }, index) => !items||items.length===0?
        <Checkbox key={index} isChecked={isChecked} onClick={onClick}
        onChange={onChange} {...props}>
        {title}
    </Checkbox>:<Popover key={index}>
        <PopoverTrigger>
            <Checkbox isChecked={isChecked} onClick={onClick} onChange={onChange} {...props}>
                {title}
            </Checkbox>
        </PopoverTrigger>
        <PopoverContent>
            <PopoverBody>
                <SimpleGrid>
                    {/* checkbox group */}
                    <CheckBoxList items={items} {...props} />
                </SimpleGrid>
            </PopoverBody>
        </PopoverContent>
    </Popover>)
}
export default CheckBoxList