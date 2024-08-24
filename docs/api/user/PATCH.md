# /user

---

- `Authorization: Yes`

- `Method: PATCH`

## Data parameter

### Required

- `patchUserId: string`

### Optional

- `mail: string` // Only allowed when user can modify others
- `firstname: string`
- `lastname: string`
- `password: string`
- `roleId: number` // Only allowed when user can modify others
- `released: boolean` // Only allowed when user can modify others
- `biography: string | null`

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
