import * as React from "react";
import { Badge, Dropdown, Space, Table, Pagination } from "antd";
import { useState } from "react";
import Swal from "sweetalert2";

const CustomTableContainer = ({
  rows,
  columns,
  columns2,
  total,
  limit,
  offset,
  setOffset,
  setLimit,
  footer,
  rowSelection,
  selectedRowIds,
  setSelectedRowIds,
  rowKey,
  removePagination,
}) => {
  console.log("rows: ", rows);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]); // Track the expanded rows
  console.log("expandedRowKeys: ", expandedRowKeys);

  const handleOnChange = (page) => {
    console.log("page: ", page);
    setOffset(page * limit - limit);
  };

  const handleChangeSize = (current, size) => {
    setOffset(0);
    setLimit(size);
  };

  // Expanded row renderer for the booking details
  const expandedRowRender = (record) => {
    console.log("record.bookingDetails: ", record.bookingDetails);
    let selectedKey = [];
    record.bookingDetails?.map((er, i) => {
      console.log("er?.status: ", er?.status);
      if (er?.status === "Completed") {
        selectedKey?.push(er[`${rowKey}`]);
      }
    });

    return rowSelection ? (
      <Table
        columns={columns2}
        dataSource={record.bookingDetails} // Show bookingDetails in expanded row
        pagination={false}
        rowSelection={{
          type: "checkbox",
          selectedRowKeys: [...selectedRowIds, ...selectedKey],
          onChange: (selectedKeys) => {
            console.log("selectedKeys: ", selectedKeys);
            // setSelectedRowIds(selectedKeys);
          },
          defaultSelectedRowKeys: selectedKey,
          getCheckboxProps: (row) => ({
            disabled: row?.status === "Completed",

            // Disable checkbox if row is already selected
          }),
        }}
        rowKey={(row) => row[`${rowKey}`]} // Use unique key for bookings
      />
    ) : (
      <Table
        columns={columns2}
        dataSource={record.bookingDetails} // Show bookingDetails in expanded row
        pagination={false}
        rowKey={rowKey}
      />
    );
  };

  // Handle row expand/collapse events
  const onExpand = (expanded, record) => {
    console.log("record: ", record);
    if (expanded) {
      // Expand the clicked row
      setExpandedRowKeys([record.userid]); // Keep only one expanded row at a time
    } else {
      // Collapse the row
      setExpandedRowKeys([]);
    }
  };

  let selectedKey = [];
  rows?.map((er, i) => {
    console.log("er?.status: ", er?.status);
    if (er?.status === "Completed") {
      selectedKey?.push(er[`${rowKey}`]);
    }
  });

  const handleDelete = async (itemId) => {
    await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setSelectedRowIds(itemId);
      }
    });
  };
  return (
    <div>
      {columns2 ? (
        <Table
          columns={columns}
          dataSource={rows}
          expandable={{
            expandedRowRender,
            expandedRowKeys, // Set the expanded rows
            onExpand: onExpand, // Handle expand/collapse
          }}
          footer={footer ? footer : false}
          bordered
          rowKey="userid"
          pagination={false}
        />
      ) : rowSelection ? (
        <Table
          columns={columns}
          dataSource={rows}
          pagination={false}
          rowSelection={{
            type: "checkbox",
            selectedRowKeys: [...selectedRowIds, ...selectedKey],
            onChange: (selectedKeys) => {
              console.log("selectedKeys: ", selectedKeys);
              // setSelectedRowIds(selectedKeys);
              handleDelete(selectedKeys);
            },
            defaultSelectedRowKeys: selectedKey,
            getCheckboxProps: (row) => ({
              disabled: row?.status === "Completed",

              // Disable checkbox if row is already selected
            }),
          }}
          rowKey={(row) => row[`${rowKey}`]} // Use unique key for bookings
        />
      ) : (
        <Table
          columns={columns}
          rowKey="userId"
          dataSource={rows}
          rowSelection={rowSelection}
          bordered
          footer={footer ? footer : false}
          pagination={false}
        />
      )}
      {!removePagination && (
        <div className="flex justify-end mt-3">
          <Pagination
            defaultCurrent={1}
            total={total}
            defaultPageSize={limit}
            current={offset / limit + 1}
            onChange={handleOnChange}
            showSizeChanger={true}
            onShowSizeChange={handleChangeSize}
          />
        </div>
      )}
    </div>
  );
};

export default CustomTableContainer;
