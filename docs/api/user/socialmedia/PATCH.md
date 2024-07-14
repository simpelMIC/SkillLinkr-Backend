# /user/socialmedia

---

- `Authorization: Yes`

- `Method: PATCH`

## Data parameter

### Required

- `patchUserId: string`

### Optional

- `xName: string | null`
- `instagramName: string | null`
- `discordName: string | null`
- `facebookName: string | null`

### Success response

Status is defined in the Status.md file

```
Status code: 200
Content: {
  status: 'success',
  message: 'Teaching information updated',
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
