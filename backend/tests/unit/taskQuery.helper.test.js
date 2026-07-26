/**
 * Unit tests for buildTaskQuery - deliberately DB-free since the helper
 * is a pure function. These run fast and don't need mongodb-memory-server.
 */
const { buildTaskQuery } = require('../../src/helpers/taskQuery.helper');

describe('buildTaskQuery', () => {
  test('defaults to page 1, limit 10, sorted by createdAt desc', () => {
    const { filter, pagination, sort } = buildTaskQuery({});
    expect(filter).toEqual({});
    expect(pagination).toEqual({ page: 1, limit: 10, skip: 0 });
    expect(sort).toEqual({ createdAt: -1 });
  });

  test('builds a case-insensitive regex filter for search', () => {
    const { filter } = buildTaskQuery({ search: 'Report' });
    expect(filter.title).toEqual({ $regex: 'Report', $options: 'i' });
  });

  test('passes through valid status and priority filters', () => {
    const { filter } = buildTaskQuery({ status: 'Done', priority: 'High' });
    expect(filter.status).toBe('Done');
    expect(filter.priority).toBe('High');
  });

  test('computes correct skip for page > 1', () => {
    const { pagination } = buildTaskQuery({ page: '3', limit: '5' });
    expect(pagination).toEqual({ page: 3, limit: 5, skip: 10 });
  });

  test('clamps limit to a maximum of 100', () => {
    const { pagination } = buildTaskQuery({ limit: '9999' });
    expect(pagination.limit).toBe(100);
  });

  test('falls back to page 1 for invalid/negative page values', () => {
    const { pagination } = buildTaskQuery({ page: '-5' });
    expect(pagination.page).toBe(1);
  });

  test('ignores unrecognized sortBy fields and falls back to createdAt', () => {
    const { sort } = buildTaskQuery({ sortBy: 'notAField' });
    expect(sort).toEqual({ createdAt: -1 });
  });

  test('respects ascending order when requested', () => {
    const { sort } = buildTaskQuery({ sortBy: 'dueDate', order: 'asc' });
    expect(sort).toEqual({ dueDate: 1 });
  });
});
