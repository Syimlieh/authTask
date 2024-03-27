const { ORDER_DIRECTIONS, USER_ROLES } = require("../utils/constants.utils");

const getUsersPipeline = (filters) => {
  const { visibility = "" } = filters;
  const $match = {
    userRole: { $ne: USER_ROLES.ADMIN }
  };
  if (visibility) {
    $match.visibility = visibility;
  }

  const page = parseInt(filters.page || 1);
  const limit = parseInt(filters.limit || 1000);
  const order_by = filters.order_by || "updatedAt";
  const order_direction = filters.order_direction || ORDER_DIRECTIONS.ASC;

  const $sort = {};
  $sort[order_by] =
    order_direction.toUpperCase() === ORDER_DIRECTIONS.ASC ? 1 : -1;

  const $skip = (page - 1) * limit;
  const $limit = limit;

  const $project = { password: 0, __v: 0 };

  const $facet = {
    records: [{ $skip }, { $limit }],
    pagination: [{ $count: "totalRecords" }],
  };

  return [{ $match }, { $project }, { $sort }, { $facet }];
};

module.exports = {
  getUsersPipeline,
};
