/**
 * Pure helper that turns query-string params into the shapes the
 * repository needs: a Mongo filter object, and pagination/sort options.
 * Kept pure (no DB, no req/res) so it's trivially unit-testable.
 */

const ALLOWED_SORT_FIELDS = ['createdAt', 'dueDate', 'priority', 'title'];

function buildTaskQuery(query) {
  const filter = {};

  if (query.search) {
    // Case-insensitive partial match on title. A $text index search is an
    // alternative, but regex is more forgiving for partial/substring search
    // ("proj" matching "Project Kickoff"), which is the more common UX expectation.
    filter.title = { $regex: query.search.trim(), $options: 'i' };
  }

  if (query.status) {
    filter.status = query.status;
  }

  if (query.priority) {
    filter.priority = query.priority;
  }

  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(query.limit, 10) || 10, 1), 100); // cap at 100/page
  const skip = (page - 1) * limit;

  let sortField = ALLOWED_SORT_FIELDS.includes(query.sortBy) ? query.sortBy : 'createdAt';
  const sortOrder = query.order === 'asc' ? 1 : -1;
  const sort = { [sortField]: sortOrder };

  return { filter, pagination: { page, limit, skip }, sort };
}

module.exports = { buildTaskQuery, ALLOWED_SORT_FIELDS };
