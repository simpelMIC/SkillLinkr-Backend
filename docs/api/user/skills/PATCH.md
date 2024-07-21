# /user/skills

---

- `Authorization: Yes`

- `Method: PATCH`

## Data parameter

### Required

- `patchUserId: string`
- `teachSkillIds: stringified number array`
  - e.g. `"[1, 2]"`
  - Must include all ids of skills a user can teach

### Optional

- `None`

### Success response

Status is defined in the Status.md file

```
Status code: 200
Content: {
  status: 'success',
  message: 'User updated',
}
```

### Error response

```
Status code: 400
Content: {
  status: 'error' | 'unauthorized',
  message: string,
}
```
